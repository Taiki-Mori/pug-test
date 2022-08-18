# Coding Template

## Requirement

---

### 開発環境

- Node.js v16.13.0
- npm 8.1.0
- gulp 4.0.2
- webpack 4.44.2

- pug
- dart sass

<br>

### 使用タイミング

- 静的コーディング
- wordpress
- 自社開発向け

<br>

## Pug Rule

---

- common ... 全ページ共通で使用するファイル、モジュール
- component ... 各ページ共通で使うようなモジュール(ボタン、見出しなど) SCSS と連動
- gtm ... Google タグマネージャーを設置する場合のファイル
- mixin ... 関数のように使い回せるモジュール
- page ... ページ独自で使われるセクション、モジュール
- project ... 複数のページをまたいで使われるセクション、component に該当しないモジュール
- setting ... 全てのページの元になるテンプレート、meta 関連の基本設定

- 〇〇.pug ... html として出力されるファイル。ページ毎に作成

<br>

## CSS Rule

---

- animation ... 使い回すアニメーションを mixin にして登録
- component ... 各ページ共通で使うようなモジュール(ボタン、見出しなど) Pug と連動
- foundation ... 変数、関数、mixin、reset.css 等の設定関連

  - base ... reset.css に追加する基本の css
  - breakpoints ... メディアクエリ関連の変数、mixin
  - color ... 色関連
  - font ... フォント関連の変数、mixin
  - function ... 使い回す関数
  - mixin ... breakpoints、font に当てはまらない mixin 全て
  - reset ... reset.css (destyle.css v3.0.2 | MIT License | https://github.com/nicolas-cusan/destyle.css \*/)
  - variable ... breakpoints, color, font に当てはまらない変数全て

    <br>

- layout ... FLOCSS の Layout
- lib ... ライブラリの css を上書きするファイル
- page ... ページ独自で使われるセクションに当てる css
- projcet ... 複数のページをまたいで使われるセクション、component に該当しないモジュールに当てる css
- utility ... スタイルの微調整に使用する css (最終手段)

### 補足

- PDFLOCSS がベース (https://zenn.dev/wagashi_osushi/books/94efd21a66ccaa/viewer/349ad3)
- page/ で管理するページ独自の css は[page-] という独自の接頭詞を追加(about- works- など)
- index.scss などにはページのファイルにはスタイルを書かず include で読み込むのみにする

<br>

## Usage

---

```zsh
npm i -D
```

静的ページ開発時

```zsh
npm run server
```

WPテーマ開発時

```zsh
npm run wp
```

本番静的ページ用

```zsh
npm run build
```

本番WPテーマ用

```zsh
npm run wpbuild
```
