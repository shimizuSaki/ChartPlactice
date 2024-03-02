
/**
 * 必要な要素を最初に全部取得しておく
 */
const $inputPrice = $("#js-input-price");
const $checkOption1 = $("#js-check-option-1");
const $checkOption2 = $("#js-check-option-2");
const $inputTotalPrice = $("#js-input-total-price");
const $inputTotalPriceInTax = $("#js-input-total-price-in-tax");

/**
 * 合計金額計算の関数
 */
const calc = function () {
  // 入力した値を取得して数値に変換（入力した値が無いなら0とする）
  const price = Number($inputPrice.val()) ?? 0;
  // チェック済かどうかを取得
  const isCheckedOption1 = $checkOption1.prop("checked");
  const isCheckedOption2 = $checkOption2.prop("checked");
  // 合計金額を取得する関数
  // （数値で返ってくる）
  const getTotalPrice = function () {
    let resultPrice = price;
    if (isCheckedOption1) {
      resultPrice = resultPrice + 1000;
    }
    if (isCheckedOption2) {
      resultPrice = resultPrice - 2000;
    }
    return resultPrice;
  };
  // 合計のinputに合計金額を反映
  // Math.floorで小数点以下切り捨て、toLocaleStringでカンマ付ける処理を行う
  $inputTotalPrice.val(getTotalPrice().toLocaleString());
  $inputTotalPriceInTax.val(Math.floor(getTotalPrice() * 1.1).toLocaleString());
};

/**
 * エラーメッセージ要素を生成する関数
 */
const createErrorMessage = function () {
  $inputPrice.after(
    '<div id="js-create-error-message" style="display: none;">Error!</div>'
  );
};

/**
 * エラーチェック（本体価格に数値以外を入力したらエラーメッセージ表示）の関数
 * （エラーならtrue、エラー無しならfalse を返す）
 */
const errorCheck = function () {
  // 入力した値を取得
  const value = $inputPrice.val();
  // 数値かどうかをチェックする（正規表現）
  // 数値じゃないならエラーメッセージを表示する
  if (!value.match(/^[0-9]*$/)) {
    $("#js-create-error-message").show();
    return true;
  } else {
    $("#js-create-error-message").hide();
    return false;
  }
};

// ページ全体が読み込まれたら実行
$(window).on("load", function () {
  createErrorMessage();
  const isError = errorCheck();
  if (!isError) {
    calc();
  }
});

// 本体価格入力時に実行
$inputPrice.on("input", function () {
  const isError = errorCheck();
  if (!isError) {
    calc();
  }
});

// オプションチェック変更時に実行
$checkOption1.on("input", function () {
  const isError = errorCheck();
  if (!isError) {
    calc();
  }
});
$checkOption2.on("input", function () {
  const isError = errorCheck();
  if (!isError) {
    calc();
  }
});




const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar", // グラフの種類を指定
  data: {
    labels: ["赤", "青", "黄", "緑", "紫"],
    datasets: [
      {
        label: "色の出現回数",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});




