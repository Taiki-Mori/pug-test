/**
 * @modules : node_modulesフォルダまでの絶対パスのエイリアス
 * webpack.config.jsにて定義している
 */

import $ from "@modules/jquery";
// import '@modules/swiper';

("use strict");

// PC/SP判定
// スクロールイベント
// リサイズイベント
// スムーズスクロール

/* ここから */

const breakpoint = 640;
const mql = window.matchMedia(`screen and (max-width: ${breakpoint}px)`); //、MediaQueryListの生成
let deviceFlag = mql.matches ? 1 : 0; // 0 : PC ,  1 : SP
let vw = window.innerWidth; //画面の横幅

// pagetop
let timer = null;
const $pageTop = $("#pagetop");
$pageTop.hide();

// スクロールイベント
$(window).on("scroll touchmove", function () {
  // スクロール中か判定
  if (timer !== false) {
    clearTimeout(timer);
  }

  // スクロール量が100pxを超えたら、200ms後にフェードイン
  timer = setTimeout(function () {
    if ($(this).scrollTop() > 100) {
      $("#pagetop").fadeIn("normal");
    } else {
      $pageTop.fadeOut();
    }
  }, 200);

  const scrollHeight = $(document).height();
  const scrollPosition = $(window).height() + $(window).scrollTop();
  const footHeight = parseInt($("#footer").innerHeight());

  if (scrollHeight - scrollPosition <= footHeight - 20) {
    // 現在の下から位置が、フッターの高さの位置にはいったら(bottom20px分を引いて調整)
    $pageTop.css({
      position: "absolute",
      bottom: footHeight,
    });
  } else {
    $pageTop.css({
      position: "fixed",
      bottom: "20px",
    });
  }
});

// リサイズイベント
const checkBreakPoint = function (mql) {
  deviceFlag = mql.matches ? 1 : 0; // 0 : PC ,  1 : SP
  // → PC
  if (deviceFlag === 0) {
    console.log("PC");
  } else {
    // →SP
    console.log("SP");
  }

  deviceFlag = mql.matches;
};

// ブレイクポイントの瞬間に発火
mql.addListener(checkBreakPoint); //MediaQueryListのchangeイベントに登録

// 初回チェック
checkBreakPoint(mql);

// スムーズスクロール
// #で始まるアンカーをクリックした場合にスムーススクロール
$('a[href^="#"]').on("click", function () {
  const speed = 500;
  // アンカーの値取得
  const href = $(this).attr("href");
  // 移動先を取得
  const target = $(href == "#" || href == "" ? "html" : href);
  // 移動先を数値で取得
  const position = target.offset().top;

  // スムーススクロール
  $("body,html").animate(
    {
      scrollTop: position,
    },
    speed,
    "swing"
  );
  return false;
});

/**
 * 100vh Safari対策
 */
// 1vhをブラウザにあわせて再計算
const setFillHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// 画面のサイズ変動があったら高さを再計算
window.addEventListener("resize", () => {
  if (vw === window.innerWidth) {
    return;
  }

  vw = window.innerWidth;
  setFillHeight(); //1vh計算
});

//初期化
setFillHeight();
