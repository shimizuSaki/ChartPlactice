// 初期設定
const initial_loan = 100000; //借入金額
const initial_rate = 18.0; //利率
const initial_repayment = 26000; //返済金額
const initial_duration = 100; //期間上限

// ユーザー入力値
$('#loan').val(initial_loan);
$('#rate').val(initial_rate);
$('#repayment').val(initial_repayment );

let duration = Number( 0 ); //期間


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
// const $inputPrice = Number( $("#js-input-price"));
// const $checkOption1 = Number( $("#js-check-option-1"));
// const $checkOption2 = Number( $("#js-check-option-2"));
// const $inputTotalPrice = Number( $("#js-input-total-price"));
// const $inputTotalPriceInTax = Number( $("#js-input-total-price-in-tax"));


/**
 * グラフの型を作る（chart.jsの型）
 */

let ctx = document.getElementById("myChart").getContext("2d");
let repaymentChart = new Chart(ctx, {
  type: "bar", // グラフの種類を指定
  data: {
    labels: ["お借入日"],
    datasets: [
      {
        label: "元金",
        data: [0],
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
        data: [0],
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
    tooltips: {
      // TODO:合計値を表示できるようにしたい
      //      ∟参考：https://codepen.io/jun68ykt/pen/JjPgbPQ?editors=1010
      // mode: 'nearest',
      //   intersect: false,
      //   mode: 'index',
      //   callbacks: {
      //     afterTitle: (items, data) => {
      //       const values = items.map(e => e.value !== 'NaN' ? +e.value : 0 );
      //       return `合計値: ${values[0] + values[1]}`;
      //     },
      //     label: (item, data) => {
      //       const { label } = data.datasets[item.datasetIndex];
      //       const value = item.value.replace('NaN', '');
      //       return value && `${label}: ${value}`;
      //     }
      //   }
    },
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




// シミュレーションchart出力用変数

// シミュレーション計算＆出力
// FIXME:シミュレーション結果を配列に格納し、最後にまとめて出力したほうが使いまわしに便利そう....？

function resultCalc() {
  console.log("＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝");
  console.log("resultCalc開始");
  console.log("＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝");
  let chart_labels = repaymentChart.data.labels;
  let chart_principals = repaymentChart.data.datasets[0].data;
  let chart_interests = repaymentChart.data.datasets[1].data;
  let principal = Number( 0 ); //元金
  let last_duration = Number( 0 ); //期間最終日
  let interest = Number( 0 ); //利息


  let total_repayment = Number( 0 ); //返済合計額
  let total_interest = Number( 0 ); //利息合計額


  // 入力フォームのデータを取得
  let loan = Number( $('#loan').val() );
  let rate = Number( $('#rate').val() );
  let repayment = Number( $('#repayment').val() );


  // お借入日 の処理
  principal = loan;
  chart_principals[0] = principal;
  console.log("loan = " + loan);
  console.log("principal = " + principal);
  console.log("interest = " + interest);
  
  // 試算結果表のヘッダーを出力
  $('#result').append('<thead><th>回数</th><th>返済額</th><th>元金充当</th><th>利息充当</th><th>返済残高</th></thead>');
  $('#result').append('<tr><td>お借入日</td><td></td><td></td><td></td><td>&yen;' + comma(loan) + '</td></tr>');



  // 返済処理(１回の返済ごと)
  for (let i = 1; i <= initial_duration; i++) {
    console.log(i + "回目の返済処理");
    let label = i;
    let principal_apply = Number( 0 );//元金充当金
    let interest_apply = Number( 0 );//利息充当金
    
    interest = Math.floor(principal * (rate / 100) / 12); //ざっくり12ヶ月の想定
    loan = Number( loan - repayment + interest );
    principal = loan;
    
    // FIXME:厳密な計算が必要な場合は、計算方法を確認して調整
    interest_apply = interest;
    principal_apply = Math.floor(repayment - interest);
    // console.log(interest_apply + principal_apply) //1回の返済金額と同じになっていればOK
    // principal = principal - (interest_apply + principal_apply);


    total_repayment = Number( total_repayment + repayment );
    total_interest = Number( total_interest + interest_apply);
    
    
    // tableへの出力
    $('#result').append('<tr><td>' + i + '</td><td>&yen;' + comma(repayment) + '</td><td>&yen;' + comma(principal_apply) + '</td><td>&yen;' + comma(interest) + '</td><td> &yen;' + comma(loan) + '</td></tr>');
    // $('#result').append('<tr><td>' + i + '</td><td>&yen;' + comma(repayment) + '</td><td>&yen;' + comma(0) + '</td><td>&yen;' + comma(0) + '</td><td> &yen;' + comma(loan) + '</td></tr>');
    
    
    // 足りないchart枠の追加
    if (chart_labels[i] == undefined) {
      addData(repaymentChart, label, repaymentChart.data);
    }
    chart_interests[i] = interest;
    chart_principals[i] = principal;
    duration = i;
    
    repaymentChart.update();
    
    if (loan - repayment <= Number( 0)) {
      last_duration = duration + 1;
      break;
    }
    
  }  // 返済処理(１回の返済ごと)終了


  // 返済完了日の処理
  console.log("【返済完了日の処理開始】");
  console.log("last_duration=" + last_duration);
  label = last_duration;
  addData(repaymentChart, label, repaymentChart.data);

  repayment = loan;
  total_repayment = Number( total_repayment + repayment );
  total_interest = Number( total_interest + interest);
  
  interest = Math.floor(principal * (rate / 100) / 12); //ざっくり12ヶ月の想定
  loan = Number( loan - repayment + interest );
  
  interest_apply = interest;
  principal_apply = Math.floor(repayment - interest);

  
  loan = Number( 0 );
  principal = Number( 0 );
  interest = Number( 0 );
  chart_interests[last_duration] = interest;
  chart_principals[last_duration] = principal;

  $('#result').append('<tr><td>' + last_duration + '</td><td>&yen;' + comma(repayment) + '</td><td>&yen;' + comma(principal_apply) + '</td><td>&yen;' + comma(interest_apply) + '</td><td> &yen;' + comma(loan) + '</td></tr>');
  $('#result').append('<tfoot><th>累計</th><th>&yen;' + comma(total_repayment) + '</th><th></th><th>&yen;' + comma(total_interest) + '</th><th></th></tfoot>');
  
  // 余分なchart枠の削除
  if (last_duration < chart_labels.length) {
    // last_duration = last_duration - 1 ;
    for (let j = chart_labels.length; j > last_duration+1; j--) {
    // for (let j = last_duration + 1; j < chart_labels.length; j++) {
      console.log("--chart_labels.lengthは" + chart_labels.length);
      console.log("--余分なchartの削除" + j);
      
      // TODO:removeData(repaymentChart);で、余分なchart枠だけが消えるようにする。
      console.log(repaymentChart.data.labels);
      console.log(repaymentChart.data.datasets);
      removeData(repaymentChart);
    }
    repaymentChart.update();
  }

  console.log("【返済完了日の処理終わり】");


} //resultCalc終了

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
//     initial_duration = Number( $('#initial_duration').val() );
//     resultCalc();
//   });
// });

// 返済額が選択されたときの処理
$(function() {
  $('#repayment').change(function() {
    $('#result').empty();
    repayment = Number( $('#repayment').val() );
    resultCalc();
  });
});

// 数値の入力があった場合の処理
$(function() {
  $('#loan').change(function() {
    $('#result').empty();
    loan = Number( $('#loan').val() );
    resultCalc();
  });
  $('#rate').change(function() {
    $('#result').empty();
    rate = Number( $('#rate').val() );
    resultCalc();
  });
});




// +, - ボタンが押された時、運用期間が選択された時の処理
$(function() {
  //   $('#loanSub').on('click', function() {
  //     $('#result').empty();
  //     if(loan < 10000) {
  //       loan = Number( 0 );
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
  //     if(rate <= Number( 0)) {
  //       rate = Number( 0 );
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
  