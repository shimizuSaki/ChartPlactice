// 初期設定
const initial_loan = 50000; //借入金額
const initial_rate = 18.0; //利率
const initial_repayment = 4000; //返済金額
const initial_duration = 60; //期間上限

// ユーザー入力値
$('#loan').val(initial_loan);
$('#rate').val(initial_rate);
$('#repayment').val(initial_repayment);


let loan = initial_loan; //借金
let rate = initial_rate;
let repayment = initial_repayment;


// 入力値に桁数制限を設ける
function sliceMaxLength(elem, maxLength) {
  elem.value = elem.value.slice(0, maxLength);
}

// 試算結果の数値をカンマ区切りにする
function comma(num) {
  const price = String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return price;
};




/**
 * 必要な要素を最初に全部取得しておく
 */
// const $inputPrice = $("#js-input-price");
// const $checkOption1 = $("#js-check-option-1");
// const $checkOption2 = $("#js-check-option-2");
// const $inputTotalPrice = $("#js-input-total-price");
// const $inputTotalPriceInTax = $("#js-input-total-price-in-tax");


/**
 * グラフの型を作る（chart.jsの型）
 */

// TODO:chartに合計値を表示できるようにしたい
//      ∟参考：https://teratail.com/questions/214855
let ctx = document.getElementById("myChart").getContext("2d");
let repaymentChart = new Chart(ctx, {
  type: "bar", // グラフの種類を指定
  data: {
    labels: ["お借入日","1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "元金",
        data: [0,0,0,0,0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          // "rgba(54, 162, 235, 0.2)",
          // "rgba(255, 206, 86, 0.2)",
          // "rgba(75, 192, 192, 0.2)",
          // "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          // "rgba(54, 162, 235, 1)",
          // "rgba(255, 206, 86, 1)",
          // "rgba(75, 192, 192, 1)",
          // "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
      {
        label: "利息(sample)",
        data: [0,0,0,0,0],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          // "rgba(54, 162, 235, 1)",
          // "rgba(255, 206, 86, 1)",
          // "rgba(75, 192, 192, 1)",
          // "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        stacked: true,
      },
        y: {
          beginAtZero: true,
          stacked: true,
        },
    },
  },
});




// シミュレーション出力用変数
let chart_labels = repaymentChart.data.labels;
let chart_principals = repaymentChart.data.datasets[0].data;
let chart_interests = repaymentChart.data.datasets[1].data;




// シミュレーション計算＆出力
// HACK:シミュレーション結果を配列に格納し、最後にまとめて出力したほうが使いまわしに便利そう....？

function resultCalc() {
  let principal = 0; //元金
  let interest = 0; //利息
  let interest_apply = 0;//利息充当金
  let principal_apply = 0;//元金充当金
  let duration = 0; //期間

  // 試算結果表のヘッダーを出力
  $('#result').append('<tr><th>回数</th><th>返済<br>金額</th><th>元金<br>充当</th><th>利息<br>充当</th><th>元金</th></tr>');
  
  // お借入日 の処理
  principal = loan;
  chart_principals[0] = principal;
  $('#result').append('<tr><td>お借入日</td><td></td><td></td><td></td><td>&yen;' + comma(loan) + '</td></tr>');
  
  // 返済処理(１回ごと)
  for (let i = 1; i <= initial_duration; i++) {
    let label = i + "(label)";

    // TODO:計算方法を確認して計算を実装(利息充当金＆元金充当金)
    principal = principal - repayment;
    interest = Math.floor(principal * (rate / 100));
    // interest_apply = Math.floor(principal * (rate / 100));
    // principal_apply = Math.floor(principal * (rate / 100));
    

    // tableへの出力
    $('#result').append('<tr><td>' + i + '</td><td>&yen;' + comma(repayment) + '</td><td>&yen;' + comma(principal_apply) + '</td><td>&yen;' + comma(interest_apply) + '</td><td> &yen;' + comma(principal) + '</td></tr>');


    // グラフの型が不足している場合に、グラフの型を追加する
    if (chart_labels[i] == undefined) {
      addData(repaymentChart, label, repaymentChart.data);
    }

    chart_interests[i] = interest;
    chart_principals[i] = principal;
    // 返済完了の処理
    if (principal - repayment <= 0) {
      console.log("最終日の処理開始" + [i]);
      duration = [i];
      repayment = principal;

      principal = 0;
      
      $('#result').append('<tr><td>' + (i+1) + '</td><td>&yen;' + comma(repayment) + '</td><td>&yen;' + comma(principal_apply) + '</td><td>&yen;' + comma(interest_apply) + '</td><td> &yen;' + comma(principal) + '</td></tr>');
      // TODO:グラフの型が超過している場合、超過分しているグラフの型を削除する
      if (duration != 0) {
        i = i++;
        // removeData(repaymentChart);
      }
      return;
    }
    repaymentChart.update()
  }  
}

function addData(chart, label, newData) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(newData);
  });
  chart.update();
}

function removeData(chart) {
  console.log("removeDataが読み込まれました");
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
  });
  chart.update();
}


resultCalc();

// 期間が選択されたときの処理
// $(function() {
//   $('#initial_duration').change(function() {
//     $('#result').empty();
//     initial_duration = $('#initial_duration').val();
//     resultCalc();
//   });
// });
// 返済額が選択されたときの処理
$(function() {
  $('#repayment').change(function() {
    $('#result').empty();
    repayment = $('#repayment').val();
    resultCalc();
  });
});

// 数値の入力があった場合の処理
$(function() {
  $('#loan').change(function() {
    $('#result').empty();
    loan = Number($('#loan').val());
    resultCalc();
  });
  $('#rate').change(function() {
    $('#result').empty();
    rate = Number($('#rate').val());
    resultCalc();
  });
});




// +, - ボタンが押された時、運用期間が選択された時の処理
$(function() {
  //   $('#loanSub').on('click', function() {
  //     $('#result').empty();
  //     if(loan < 10000) {
  //       loan = 0;
  //     } else {
  //       loan -= 10000;
  //     }
  //     $('#loan').val(loan);
  //     resultCalc();
  //   });
  //   $('#loanAdd').on('click', function() {
  //     $('#result').empty();
  //     if(loan < 990000) {
  //       loan += 10000;
  //     } else {
  //       loan = 999999;
  //     }
  //     $('#loan').val(loan);
  //     resultCalc();
  //   });
  
  //   $('#rateSub').on('click', function() {
  //     $('#result').empty();
  //     if(rate <= 0) {
  //       rate = 0;
  //     } else {
  //       rate = rate - 0.1;
  //       $('#rate').val(rate);
  //     }
  //     resultCalc();
  //   });
  //   $('#rateAdd').on('click', function() {
  //     $('#result').empty();
  //     if(rate < 99) {
  //       rate = rate + 0.1;
  //       $('#rate').val(rate);
  //     }
  //     resultCalc();
  //   });
  });
  