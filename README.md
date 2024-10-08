# Linker
実利8割ネタ2割の、記憶定着補助と利用ユーザー間での情報共有に便利なウェブアプリです。

# 概要｜Description
　担当業務でVue.jsを使う機会があったので、そこで得た知識をもっと活かすべく、その業務の卒業制作的な意味合いも兼ねてこのアプリを作りました。<br>
　大事な情報。一度収集して記憶出来ても、他にたくさんの情報が入ってきたなら、いつの間にか抜け落ちてしまい、思い出せない。活かせない・・・<br>
　このアプリは、そんなもどかしさにお困りのあなたの、頼れる味方になってくれるかもしれませんよ！？<br>
　情報収集、情報整理、試験対策、学びなおし・・・お好きな用途でご利用ください。

# インストール方法｜Install
## クローンする場合｜Clone
ターミナルまたはコマンドプロンプトで、こちらを入力して下さい。パッケージをインストールできます。
```
$ git clone https://github.com/Kampanman/Linker.git
```
パッケージを別名で保存する場合は、以下のように入力して下さい。
```
$ git clone https://github.com/Kampanman/Linker.git [お好きなプロジェクト名]
```
## サーバーへのアップロード｜Upload
クローンが終了しましたら、お使いのサーバーにアップロードして下さい。
尚、製作者が利用しているサーバーはこちらです。
```
https://secure.sakura.ad.jp/rs/cp/
```
## DBコネクション設定｜Database Connection
/Linker/server/db.phpにアクセスし、$dsn,$dbname,$username,$passwordのそれぞれを、お使いのデータベースに合わせて編集してください。
## SQL読み込み｜SQL Reading
お使いのMySQLで、/Linker/sqlに格納されている次のsqlファイルをインポートしてください。
- linker_accounts.sql
- linker_accounts_settingInsertWords.sql
- linker_notes.sql
- linker_videos_for_csv.sql
- linker_videos_settingTags.sql

# 基本操作方法｜Basic Usage
## キーワード・ノート検索｜Keyword & Note Searching
- 画面左上の検索アイコンをクリックすると、検索フォームが出てきます。
- 検索ワードを入力して検索を実行すると、そのワードについての検索結果が掲載されている、Google, All About, Wikipedia, Twitter, Youtube のページを表示するボタンが出てきます。
- コモンページでは、ノート・動画検索を有効にすると、そのワードが含まれる、各ユーザーが公開設定で登録したノート・動画を検索できます。
## ログイン｜Login
- 画面右上のログインアイコンをクリックすると、ログインフォームが出てきます。
- 登録されているユーザーアカウント情報を、ログインフォームに入力して、ログインを実行してください。
- 認証されれば、ログインセッションを開始し、個別マイページに遷移します。
- 個別マイページでは、ユーザーのみが閲覧できる非公開のレコードも含めたノート・動画の検索と、ノート・動画・アカウントの編集が可能です。
- 講師権限を持つユーザの場合は、アカウントタブで、他のアカウントの情報を編集することができます。

# 旧来の更新内容｜Updates History
- 基本機能搭載完了：2022/10/14 (日本の鉄道開業150周年記念日)
- バージョン1.0（β版）GitHub公開開始：2022/10/20
- バージョン2.0（β版）GitHub公開開始：2022/11/03  
  - linker_videosテーブルに「tags」カラムを追加  
  - linker_videosテーブルの「title」の文字数上限を上方修正  
  - 講師権限保有者が他ユーザーの登録情報を修正する場合、アカウント名・アカウントIDの編集如何を選択できる機能を追加  
- バージョン3.0（β版）GitHub公開開始：2022/11/08  
  - ユーザーが独自にキーワードを設定し、ノート編集画面で挿入できるボタンの機能を追加  
  - 出力される登録ノートを画面上で閲覧しやすくなるように、フォントサイズ・レイアウトを修正  
- バージョン3.5（β版）GitHub公開開始：2022/11/18  
  - ログイン後にアクセス可能なノート編集画面でも、編集中のノートをダウンロードできる機能を追加  
  - 選択したノートの詳細エリアで「ガチャ動画」の表示／非表示を切り替える機能を追加  
- バージョン4.0（β版）GitHub公開開始：2022/12/05  
  - 削除されたノート・動画がある場合、新しく登録したノート・動画が、削除されたレコードのIDで登録される機能を追加  
  - ノート表示時のリスト間の間隔を拡張 & 横幅940px以下のスクリーンでのリストの文字サイズアップ  
- バージョン4.5（β版）GitHub公開開始：2022/12/12  
  - 虫食いノートには、表示したノートの本文でONにした行の文のみが反映されるように修正  
  - 表示したノートを、本文各行の選択状態に応じて一時的に保持できる「Linker Article」ページを追加  
- バージョン5.0（β版）GitHub公開開始：2023/01/16  
  - 複数のキーワードを入力してOR検索を実行した場合に、非公開のノートも表示されてしまう問題を修正  
- バージョン5.5（β版）GitHub公開開始：2023/04/30  
  - 過去に登録してきたノート・動画のアーカイブや、発展型ノートを閲覧できる「Linker Archives & Progresses」ページ機能を追加  

# 環境と使用言語｜Requirement and Language
- フロントフレームワーク：Vue.js 2.x, Vuetify 2.x, JQuery 3.3.1
- サーバー言語：PHP 7.4.30
- サーバー：Apache/2.4.54（さくらレンタルサーバー）
- データベース：MySQL 5.7（さくらレンタルサーバー）

# その他｜Note
『SPY×FAMILY』が好きなので、ページのカラーテーマを本作品の表紙みたいにしています。
