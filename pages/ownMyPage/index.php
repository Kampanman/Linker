<?php
	session_start();
  include('../../server/properties.php');
	// 個別マイページのログインセッションが有効な場合
	if($_SESSION["inSession"] == false){
		// 当ページは表示せず個別マイページに遷移
		header('Location: ../commonPage/index.php');
		exit;
	}
	$account_id = $_SESSION['account_id'];
	$login_id = htmlspecialchars($_SESSION['login_id'], \ENT_QUOTES, 'UTF-8');
	$password = htmlspecialchars($_SESSION['password'], \ENT_QUOTES, 'UTF-8');
	$username = htmlspecialchars($_SESSION['name'], \ENT_QUOTES, 'UTF-8');
	$teacherString = ($_SESSION['is_teacher']=="1") ? $teacherString = "講師・" : $teacherString = "";
  if($account_id=="1") $teacherString = "グランドマスター・";

?>

<!DOCTYPE html>
<html dir="ltr" lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=yes, maximum-scale=1.0, minimum-scale=1.0" />
    <meta name="description" content="Linker | 個別マイページ" />
    <meta name="keywords" content="" />
    <title>Linker<?php echo $echoUser ?> | 個別マイページ</title>
    <link rel="icon" href="../../images/favicon.ico">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../static/css/style.css" type="text/css" media="screen" />
    <style scoped>
      td, th {
        vertical-align: middle;  /* 中央揃え */
      }

      textarea {
        margin-bottom: 0.3em;
        margin-right: 0.3em;
      }

      .sloganSub,
      .sloganMain {
        margin-top: 5px;
        margin-bottom: 10px;
      }

      .sloganSub span {
        color: rgb(141, 0, 0);
        font-size: 25px;
        font-weight: 600;
        -webkit-text-stroke: 0.7px white;
      }

      .sloganMain span {
        font-size: 50px;
        padding: 5px 10px;
        color: white;
        background: #d29c9c;
        font-weight: 600;
        -webkit-text-stroke: 2px rgb(141, 0, 0);
      }

      .v-application--wrap {
        min-height: 0vh;
        background-color: rgb(239, 235, 222);
      }

      .dialog > div > .v-application--wrap {
        display: none;
      }
      
      .v-list-item {
        min-height: 0vh;
        height: 27px;
      }

      @media only screen and (max-width: 480px) {
        .sloganSub span {
          font-size: 20px;
          -webkit-text-stroke: 0.5px white;
        }
        .sloganMain span {
          font-size: 45px;
          -webkit-text-stroke: 1.5px rgb(141, 0, 0);
        }
        .changeFlex {
          display: block;
        }
      }
    </style>
  </head>
  <body>
    <!-- Vue Area -->
    <div id="vueForCommon">
      <!-- ヘッダー -->
      <div id="header">
        <div class="inner">
          <div style="display:flex;">
            <div class="headerIcon" title="検索フォームエリアを開きます" @click="openSearch">
              <i class="material-icons fader">search</i>
            </div>
            <div class="headerIcon" style="margin-left:5px;" title="登録・編集モードエリアを開きます" @click="openInsertEdit">
              <i class="material-icons fader">edit</i>
            </div>
          </div>
          <div class="logo" @click="openMessage">
            <img
              src="../../images/linker_logo.png" alt="" width="240" height="80" :style="styles.linkerLogoBtn" />
          </div>
          <div class="headerIcon" title="ログアウトします" @click="logoutDialog = true">
            <i class="material-icons fader">logout</i>
          </div>
        </div>
      </div>

      <!-- / WRAPPER -->
      <div id="wrapper">
        <!-- コンテンツ -->
        <section id="main">
          <!-- メッセージエリア -->
          <div
            id="messageArea"
            v-if="openSection.message"
            :class="openSection.message==true ? 'fader' : 'none'"
          >
            <slogan>
              <template #sub>
                <?php echo $teacherString.$username ?> よ
                <br /><br />
                ナニゴトも　それ単体で　記憶すな
                <br />
                他事詰め込みゃ　ヌケるが　オチだ
              </template>
              <template #main>
                <span v-if="client.mypageflg.is_teacher==1">記憶とともに在らん事を</span>
                <span v-else>丈夫な根を張る 記憶を つくろう</span>
              </template>
            </slogan>
          </div>

          <!-- 共通クロックエリア -->
          <div id="clockArea" class="fader"><digi-clock /></div>
					<span id="account_id" style="display:none;"><?php echo $account_id; ?></span>
					<span id="login_id" style="display:none;"><?php echo $login_id; ?></span>
					<span id="password" style="display:none;"><?php echo $password; ?></span>
					<span id="is_teacher" style="display:none;"><?php echo $_SESSION['is_teacher']; ?></span>
					<span id="user_name" style="display:none;"><?php echo $username; ?></span>

          <!-- 検索フォームエリア -->
          <div
            id="searchFormArea"
            v-if="openSection.search"
            :class="openSection.search==true ? 'fader' : 'none'"
          >
            <card-sec>
              <template #title><tag-title>検索フォーム</tag-title></template>
              <template #contents>
              <div align="right">
                <v-btn :style="client.palette.redFront" @click="confirmArchivePage = true">アーカイブ・プログレスを検索</v-btn>
              </div>
                <search-inner :prop="client">
                  <div
                    v-if="client.form.search.which.noteOrVideo==1 && client.form.search.gawty!=''"
                    :class="client.form.search.which.noteOrVideo==1 ? 'fader' : 'none'"
                  >
                    <label><b>自登録のみ表示： </b></label>
                    <v-btn :style="client.palette.blueBack" v-if="viewOnlyOwn == 1" @click="viewOnlyOwn = 0">有効</v-btn>
                    <v-btn :style="client.palette.blueFront" v-if="viewOnlyOwn == 0" @click="viewOnlyOwn = 1">無効</v-btn>
                  </div>
                </search-inner>
                <div align="center">
                  <p 
                    v-if="createdDoubleSet == true"
                    style="color:red;cursor:pointer;"
                    @click="createdDoubleSet = false"
                    v-text="'自登録のみを表示する場合は、登録者名を入力しないでください'"
                  ></p>
                  <p v-if="viewCountNull == true" style="color:red;cursor:pointer;" @click="viewCountNull = false">表示件数が選択されていません</p>
                  <br v-if="viewCountNull == true || createdDoubleSet == true" />
                  <div 
                    id="setlogInsert"
                    v-if="client.form.search.gawty!=''" 
                    style="margin-bottom:10px;"
                    :class="client.form.search.gawty!='' ? 'fader' : 'none'"
                  >
                    <label><b>検索結果をログに追加： </b></label>
                    <v-btn :style="client.palette.orangeBack" v-if="logInsert == 1" @click="logInsert = 0">有効</v-btn>
                    <v-btn :style="client.palette.orangeFront" v-if="logInsert == 0" @click="activatelogInsert">無効</v-btn>
                    <br v-if="wordRecordMode" /><br v-if="wordRecordMode" />
                    <p v-if="wordRecordMode" style="color:green;cursor:pointer;" align="center" @click="wordRecordMode = false"><b>検索したワードを、検索ワードログに登録します。</b></p>
                  </div>
                  <div>
                    <v-btn :style="client.palette.brownFront" :disabled="client.form.search.gawty==''" @click="doSearch">検索実行</v-btn>
                    <v-btn :style="client.palette.brownBack" @click="confirmReloadDialog = true">リロード</v-btn>
                  </div>
                  <div :style="styles.alignItem">
                    <v-btn :style="client.palette.pinkFront" @click="showSearchLog">検索ワードログを表示</v-btn>
                  </div><br />
                  <p v-if="doneLogInsert" style="color:red;cursor:pointer;" align="center" @click="doneLogInsert = false">検索ワードログを登録しました</p>
                  <p v-if="failInsert" style="color:red;cursor:pointer;" align="center" @click="failInsert = false">ログが上限に達しています。過去の不要なログを削除してください</p>
                </div>
              </template>
            </card-sec>
          </div>

          <!-- GAWTYボタンエリア -->
          <div
            v-if="openSection.gawty"
            id="gawtyButtonArea" :class="openSection.gawty==true ? 'fader' : 'none'"
          >
            <card-sec-searched :prop="'gawty'">
              <template #title><tag-title>GAWTYリンクボタン</tag-title></template>
              <template #contents>
                <div id="gawtyAreaInner" align="center">
                  <v-btn
                    :style="client.palette.blueFront + styles.mg5 + styles.ntf"
                    target="_blank" :href="gawtyItems.google"
                    v-text="'Google'"
                  ></v-btn>
                  <v-btn
                    :style="client.palette.greenFront + styles.mg5 + styles.ntf"
                    target="_blank" :href="gawtyItems.allabout"
                    v-text="'All About'"
                  ></v-btn>
                  <v-btn
                    :style="client.palette.yellowFront + styles.mg5 + styles.ntf"
                    target="_blank" :href="gawtyItems.wikipedia"
                    v-text="'Wikipedia'"
                  ></v-btn>
                  <v-btn
                    :style="'background-color:#93e6f0; color:#fff;' + styles.mg5 + styles.ntf"
                    target="_blank" :href="gawtyItems.twitter"
                    v-text="'Twitter'"
                  ></v-btn>
                  <v-btn
                    :style="client.palette.redFront + styles.mg5 + styles.ntf"
                    target="_blank" :href="gawtyItems.youtube"
                    v-text="'Youtube'"
                  ></v-btn>
                </div>
              </template>
            </card-sec-searched>
          </div>

          <!-- ノート一覧・ノート本文エリア -->
          <div id="noteArea" v-if="openSection.note" :class="openSection.note==true ? 'fader' : 'none'">
            <note-area :cl="client" :sec="openSection" :stl="styles" :items="noteItems"></note-area>
          </div>

          <!-- 動画一覧・動画フレームエリア -->
          <div id="videoArea" v-if="openSection.video" :class="openSection.video==true ? 'fader' : 'none'">
            <video-area :sec="openSection" :stl="styles" :items="videoItems"></video-area>
          </div>

          <!-- 登録・編集モードエリア -->
          <div id="insertEditArea" v-if="openSection.insertEdit==true" :class="openSection.insertEdit==true ? 'fader' : 'none'">
            <card-sec>
              <template #contents>
                <tab-frame :t1="'ノート'" :t2="'動画'" :t3="'アカウント'">
                  <template #tab1>
                    <table-note :id="accountIdForTable" :cl="client"></table-note>
                  </template>
                  <template #tab2>
                    <table-video :id="accountIdForTable" :cl="client"></table-video>
                  </template>
                  <template #tab3>
                    <table-account :id="accountIdForTable" :is_teacher="is_teacherForTable" :cl="client"></table-account>
                  </template>
                </tab-frame>
              </template>
            </card-sec>
          </div>
        </section>
        <!-- / コンテンツ -->
      </div>
      <!-- / WRAPPER -->

      <!-- アーカイブ・プログレスページ表示確認ダイアログ -->
      <dialog-frame-normal :target="confirmArchivePage" :title="'ページ表示確認'" :contents="'アーカイブ・プログレス検索ページを表示します。よろしいですか？'">
        <v-btn @click="viewArchivePage" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
        <v-btn @click="confirmArchivePage = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
      </dialog-frame-normal>

      <!-- リロード確認ダイアログ -->
      <dialog-frame-normal :target="confirmReloadDialog" :title="'リロード確認'" :contents="'画面の再読み込みをします。よろしいですか？'">
        <v-btn @click="doReload" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
        <v-btn @click="confirmReloadDialog = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
      </dialog-frame-normal>

      <!-- ログアウト確認ダイアログ -->
      <dialog-frame-normal :target="logoutDialog" :title="'ログアウト確認'" :contents="client.phrase.message.logoutConfirm">
        <v-btn @click="doLogout" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
        <v-btn @click="logoutDialog = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
      </dialog-frame-normal>

    </div>
    <!-- Vue Area -->

    <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
    <!-- ↓ 非同期通信を実行するために必要 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="../../static/js/JQ01_gotoTop.js"></script>
    <script type="module">
      import client from '../../static/js/VJ03_client.js';
      import colorPalette from '../../static/js/VJ04_colorPalette.js';
      import cardSection from '../../static/js/VJCP_cardSection.js';
      import cardSectionAfterSearch from '../../static/js/VJCP_cardSectionAfterSearch.js';
      import tagTitle from '../../static/js/VJCP_tagTitle.js';
      import slogan from '../../static/js/VJCP_slogan.js';
      import digiClock from '../../static/js/VJCP_digiClock.js';
      import searchFormInner from '../../static/js/VJCP_searchFormInner.js';
      import noteArea from '../../static/js/VJCP_noteArea.js';
      import videoArea from '../../static/js/VJCP_videoArea.js';
      import dialogFrameNormal from '../../static/js/VJCP_dialogFrameNormal.js';
      import tabFrame from '../../static/js/VJCP_tabFrame.js';
      import dataTableForNote from '../../static/js/VJCP_dataTableForNote.js';
      import dataTableForVideo from '../../static/js/VJCP_dataTableForVideo.js';
      import dataTableForAccount from '../../static/js/VJCP_dataTableForAccount.js';
      import accountSelfEdit from '../../static/js/VJCP_accountSelfEdit.js';

      // #vueForCommon内でVue.jsの機能を有効化する
      const common = new Vue({
        el: '#vueForCommon',
        vuetify: new Vuetify(),
        data: function () {
          return {
            headerObject: {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
            client: client,
            accountIdForTable: Number(document.getElementById("account_id").innerText),
            is_teacherForTable: Number(document.getElementById("is_teacher").innerText),
            viewOnlyOwn: 0,
            logInsert: 0,
            doneLogInsert: false,
            failInsert: false,
            viewCountNull: false,
            wordRecordMode: false,
            createdDoubleSet: false,
            palette: colorPalette,
            openSection: {
              message: true,
              login: false,
              search: false,
              gawty: false,
              note: false,
              noteInto: false,
              video: false,
              videoInto: false,
              insertEdit: false,
            },
            confirmArchivePage: false,
            confirmReloadDialog: false,
            logoutDialog: false,
            styles: {
              linkerLogoBtn: "cursor: pointer; border: 3px solid #f1a753; border-radius: 5px;",
              teacherBadge: `border: 2px solid orange;border-radius: 5px;background: yellow;
                padding: 5px;color: red;font-weight: 600;font-size: 12px;margin-right:2px;`,
              viewButton: `border: 2px solid gray;
                border-radius: 15px;
                background: rgb(170, 170, 170);
                padding: 5px;color: white;
                font-weight: 600;
                font-size: 12px;
                margin-left:5px;
                min-height:'';
                height:20px;
              `,
              widthFlex: 'display:flex;justify-content: space-between;',
              alignItem: 'margin:10px 5px;align-items:center;',
              mg5: 'margin: 5px;',
              ntf: 'text-transform: none;',
              textEnhance: 'color:#0082ff; font-weight:600;',
            },
            loginJudge: "",
            gawtyItems: "",
            noteItems: "",
            videoItems: "",
          };
        },
        created: function () {
          this.init();
        },
        methods: {
          // 画面初期表示処理
          async init() {
            this.getAccountInfo();
            this.client.form.search.which.noteOrVideo = 1;
            console.log('init.client', this.client);
          },
          getAccountInfo() {
            let numIs_teacher = Number(document.getElementById("is_teacher").innerText);
            let numAccountID = Number(document.getElementById("account_id").innerText);
            this.client.mypageflg.is_teacher = numIs_teacher;
            this.client.form.auth = {
              accountID: numAccountID,
              loginID: document.getElementById("login_id").innerText,
              name: document.getElementById("user_name").innerText,
              password: document.getElementById("password").innerText,
            };
          },
          openMessage() {
            this.resetOpenAreas();
          },
          openSearch() {
            this.resetOpenAreas();
            this.openSection.message = false;
            this.openSection.search = true;
          },
          openInsertEdit() {
            this.resetOpenAreas();
            this.openSection.message = false;
            this.openSection.insertEdit = true;            
          },
          doLogout() {
            location.href = "../logout/index.php";
          },
          showSearchLog() {
            this.resetBeforeSearch();
            let data = {
              user_id: this.client.form.auth.accountID,
              is_teacher: this.client.mypageflg.is_teacher,
              search_for: 'list', // list:一覧を取得, single:個別のノート・動画を取得
              gawty: "検索ワードログ",
              created_user: this.client.form.auth.name,
              term_start: "", term_end: "", view_count: 1,
              note_or_video: 1, and_or: 0, title_or_body: 0, only_own: 1,
            };

            // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
            let params = new URLSearchParams();
            Object.keys(data).forEach(function (key) {
              params.append(key, this[key]);
            }, data);

            // ajax通信実行
            axios
              .post('../../server/api/searchGetter.php', params, this.headerObject)
              .then(response => {
                let gawtyResult = response.data.result.gawty;
                this.gawtyItems = {
                  google: "https://www.google.com/search?q=記憶&hl=ja&source=hp",
                  allabout: "https://search.allabout.co.jp/?q=記憶#gsc.tab=0&gsc.q=記憶&gsc.page=1",
                  wikipedia: "https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8",
                  twitter: "https://twitter.com/search?q=記憶&src=typed_query",
                  youtube: "https://www.youtube.com/results?search_query=記憶",
                };
                this.noteItems = response.data.result.note;
                this.videoItems = response.data.result.video;
                this.openSection.note = true;
                this.openSection.video = true;
              }).catch(error => alert("通信に失敗しました。"));
          },
          doSearch() {
            if(this.client.form.search.viewCount == ''){
              this.viewCountNull = true;
              return;
            }
            if(this.client.form.search.createdUser != "" && this.viewOnlyOwn == 1){
              this.createdDoubleSet = true;
              return;
            }
            this.resetBeforeSearch();
            let searches = this.client.form.search;
            let data = {
              user_id: this.client.form.auth.accountID,
              is_teacher: this.client.mypageflg.is_teacher,
              search_for: 'list', // list:一覧を取得, single:個別のノート・動画を取得
              gawty: searches.gawty,
              created_user: searches.createdUser,
              term_start: searches.term.start,
              term_end: searches.term.end,
              view_count: searches.viewCount,
              note_or_video: searches.which.noteOrVideo,
              and_or: searches.which.andOr,
              title_or_body: searches.which.titleOrBody,
              only_own: this.viewOnlyOwn,
            };

            // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
            let params = new URLSearchParams();
            Object.keys(data).forEach(function (key) {
              params.append(key, this[key]);
            }, data);

            // ajax通信実行
            axios
              .post('../../server/api/searchGetter.php', params, this.headerObject)
              .then(response => {
                let gawtyResult = response.data.result.gawty;
                this.gawtyItems = {
                  google: gawtyResult.google,
                  allabout: gawtyResult.allabout,
                  wikipedia: gawtyResult.wikipedia,
                  twitter: gawtyResult.twitter,
                  youtube: gawtyResult.youtube,
                };
                if (this.client.form.search.which.noteOrVideo == 1) {
                  this.noteItems = response.data.result.note;
                  this.videoItems = response.data.result.video;
                  if (this.noteItems.length > 1) this.noteItems.slice(-1)[0].last = 1;
                  if (this.videoItems.length > 1) this.videoItems.slice(-1)[0].last = 1;
                  this.openSection.note = true;
                  this.openSection.video = true;
                }
              }).catch(error => alert("通信に失敗しました。"));

              // 個人検索ログに検索結果を挿入（ログデータがない場合はレコード作成）
              this.insertSearchLog();
          },
          doReload() {
            location.reload();
          },
          resetBeforeSearch() {
            // gawtyエリアの各ボタンリンクを初期化
            this.gawtyItems = {};
            // ノート・動画一覧を初期化
            this.noteItems = [];
            this.videoItems = [];
            // オープンセクションエリアを初期化
            this.resetOpenSection();
            this.openSection.gawty = true;
            this.getAccountInfo();
          },
          resetOpenSection() {
            // 検索時の個別エリアを初期化する
            this.openSection = {
              search: true,
              gawty: false,
              note: false,
              noteInto: false,
              video: false,
              videoInto: false,
              insertEdit: false,
            };
          },
          resetOpenAreas() {
            // 画面の表示を画面遷移時の状態に戻す
            client.method.reset_input();
            this.openSection = {
              message: true,
              insertEdit: false,
              search: false,
              gawty: false,
              note: false,
              noteInto: false,
              video: false,
              videoInto: false,
            };
          },
          reset_authInput() {
            // ログインフォームの入力値を初期化
            client.form.auth = { loginID: '', password: '' };
          },
          viewArchivePage(){
            // 架空のformを生成し、送信先を設定する
            var form = document.createElement('form');
            form.action = './archiveProgressSearch.php';
            form.method = 'POST';
            form.target = '_blank';

            // 一時的にbodyに追加
            document.body.append(form);
            
            const accountId = document.querySelector('#account_id');
            const loginId = document.querySelector('#login_id');
            const isTeacher = document.querySelector('#is_teacher');
            
            // formdata イベントに関数を登録(submit する直前に発火)
            form.addEventListener('formdata', (e) => {
              var fd = e.formData;              
              fd.set("account_id", accountId.innerText);
              fd.set("login_id", loginId.innerText);
              fd.set("is_teacher", isTeacher.innerText);
            });

            // submit
            form.submit();
            // formを画面から除去
            form.remove();
            
            // 確認モーダルを閉じる
            this.confirmArchivePage = false;
          },
          loginAxios(){
            // パスワードの形式が正しいかを判定する（不正ならば処理を打ち切る）
            let regex = new RegExp(/^(?=.*[0-9])[a-zA-Z0-9.?/-]{6,16}$/);
            if(!regex.test(client.form.auth.password)){
              this.loginJudge = "passError";
              return;
            }
            // 入力されているログインIDとパスワードを送信する
            let data = {
              login_id: client.form.auth.loginID,
              password: client.form.auth.password,
            };

            // axiosでPHPのAPIにパラメータを送信する為、次のようにする
            let params = new URLSearchParams();
            Object.keys(data).forEach(function (key) {
              params.append(key, this[key]);
            }, data);

            // ajax通信実行
            axios
              .post('../../server/api/loginJudge.php', params, this.headerObject)
              .then(response => {
                console.log("response.data", response.data);
                if(response.data == 1){
                  this.loginJudge = "success";
                  setTimeout(function(){
                    location.href = "../ownMyPage/index.php";
                  }, 3000);
                }else{
                  this.loginJudge = "fail";
                };
              }).catch(error => alert("通信に失敗しました。"));
          },
          activatelogInsert() {
            this.logInsert = 1;
            this.wordRecordMode = true;
            setTimeout((e)=> this.wordRecordMode = false, 2000);
          },
          insertSearchLog() {
            if(this.logInsert==1){
              let today = new Date();
              let data = {
                user_id: this.client.form.auth.accountID,
                word: `${this.getStringFromDate(today)} | You searched ${this.client.form.search.gawty.trim()}.\n`,
              };

              // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
              let params = new URLSearchParams();
              Object.keys(data).forEach(function (key) {
                params.append(key, this[key]);
              }, data);
              
              // ajax通信実行
              axios
                .post('../../server/api/insertSearchLog.php', params, this.headerObject)
                .then(response => {
                  if(response.data=="OVER"){
                    this.failInsert = true
                  }else{
                    this.doneLogInsert = true;
                    setTimeout((e)=> this.doneLogInsert = false, 2000);
                  }
                }).catch(error => alert("通信に失敗しました。"));
            } 
          },
          getStringFromDate(date) {
            var year_str = date.getFullYear();
            var month_str = 1 + date.getMonth(); //月だけ+1する
            var day_str = date.getDate();
            var hour_str = date.getHours().toString().padStart(2, '0');
            var minute_str = date.getMinutes().toString().padStart(2, '0');
            var dayOfWeek = date.getDay() ;	// 曜日(数値)
            var dayOfWeekStr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayOfWeek] ;	// 曜日

            return `${year_str}.${month_str}.${day_str} (${dayOfWeekStr}) ${hour_str}:${minute_str}`;
          },
        },
      });
    </script>
  </body>
</html>