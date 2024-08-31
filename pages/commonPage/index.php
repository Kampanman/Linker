<?php
  include('../../server/properties.php');

  /* セッション開始 */
  session_start();
  // 個別マイページのログインセッションが有効な場合
  if(isset($_SESSION)){
    if($_SESSION["inSession"] == true){
      // 当ページは表示せず個別マイページに遷移
      header('Location: ../ownMyPage/index.php');
      exit;
    }
  }
  // 以下でリロード時にセッションを空にできる。
  session_destroy();
?>

<!DOCTYPE html>
<html dir="ltr" lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=yes, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta name="description" content="Linker | コモンページ" />
    <meta name="keywords" content="" />
    <title>Linker<?php echo $echoUser ?> | コモンページ</title>
    <link rel="icon" href="../../images/favicon.ico">
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
      rel="stylesheet"
    />
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css"
      rel="stylesheet"
    />
    <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../static/css/style.css" type="text/css" media="screen" />
    <style scoped>
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

      .dialog>div>.v-application--wrap {
        background-color: #8ea99b;
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
          <div class="headerIcon" title="検索フォームエリアを開きます" @click="openSearch">
            <i class="material-icons fader">search</i>
          </div>
          <div class="logo" title="最初のメッセージを開きます" @click="openMessage">
            <img src="../../images/linker_logo.png" alt="" width="240" height="80" :style="styles.linkerLogoBtn" />
          </div>
          <div class="headerIcon" title="ログインフォームエリアを開きます" @click="openLogin">
            <i class="material-icons fader">login</i>
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
                ナニゴトも　それ単体で　記憶すな
                <br />
                他事詰め込みゃ　ヌケるが　オチだ
              </template>
              <template #main>丈夫な根を張る 記憶を つくろう</template>
            </slogan>
          </div>

          <!-- 共通クロックエリア -->
          <div id="clockArea" class="fader"><digi-clock /></div>

          <!-- ログインフォームエリア -->
          <div
            id="loginFormArea"
            v-if="openSection.login"
            :class="openSection.login==true ? 'fader' : 'none'"
          >
            <card-sec>
              <template #title><tag-title>ログインフォーム</tag-title></template>
              <template #contents>
                <v-text-field 
                  label="ログインID" 
                  placeholder="ログインIDを入力してください（メールアドレス形式）" 
                  v-model="client.form.auth.loginID"
                ></v-text-field>
                <v-text-field 
                  label="パスワード" type="password"
                  placeholder="パスワードを入力してください（半角英数混在 6文字以上16文字以内）" 
                  v-model="client.form.auth.password"
                ></v-text-field>
                <div align="center">
                  <p v-if="loginJudge == 'fail'" style="color:red;cursor:pointer;" @click="loginJudge = ''">{{ client.phrase.message.loginFail }}</p>
                  <p v-if="loginJudge == 'passError'" style="color:red;cursor:pointer;" @click="loginJudge = ''">{{ client.phrase.validation.passwordInvalid }}</p>
                  <p v-if="loginJudge == 'stopped'" style="color:red;cursor:pointer;" @click="loginJudge = ''">{{ client.phrase.message.stoppedAccount }}</p>
                  <p v-if="loginJudge == 'success'" style="color:#0082ff;">{{ client.phrase.message.loginSuccess }}</p>
                  <br v-if="loginJudge.length > 0" />
                  <v-btn
                    :style="client.palette.brownFront"
                    :disabled="client.form.auth.loginID=='' || client.form.auth.password=='' || loginJudge == 'success'"
                    @click="loginAxios"
                  >
                    ログイン
                  </v-btn>
                  <v-btn
                    :style="client.palette.brownBack"
                    :disabled="client.form.auth.loginID=='' || client.form.auth.password=='' || loginJudge == 'success'"
                    @click="reset_authInput"
                  >
                    リセット
                  </v-btn>
                </div>
              </template>
            </card-sec>
          </div>

          <!-- 検索フォームエリア -->
          <div
            id="searchFormArea"
            v-if="openSection.search"
            :class="openSection.search==true ? 'fader' : 'none'"
          >
            <card-sec>
              <template #title><tag-title>検索フォーム</tag-title></template>
              <template #contents>
                <search-inner :prop="client">
                  <section style="margin: 5px" v-if="client.form.search.gawty!=''">
                    <label><b>ノート・動画検索</b></label>
                    <v-btn
                      :style="client.palette.blueFront"
                      v-if="client.form.search.which.noteOrVideo==0"
                      @click="client.form.search.which.noteOrVideo = 1"
                      v-text="'無効'"
                    ></v-btn>
                    <v-btn
                      :style="client.palette.blueBack"
                      v-if="client.form.search.which.noteOrVideo==1"
                      @click="client.form.search.which.noteOrVideo = 0"
                      v-text="'有効'"
                    ></v-btn>
                  </section>
                </search-inner>
                <div align="center">
                  <p v-if="viewCountNull == true" style="color:red;cursor:pointer;" @click="viewCountNull = false">表示件数が選択されていません</p>
                  <br v-if="viewCountNull == true" />
                  <v-btn :style="client.palette.brownFront" :disabled="client.form.search.gawty==''" @click="doSearch">検索実行</v-btn>
                  <v-btn :style="client.palette.brownBack" @click="confirmReloadDialog = true">リロード</v-btn>
                </div>
              </template>
            </card-sec>
          </div>

          <!-- GAWTYボタンエリア -->
          <div
            id="gawtyButtonArea"
            v-if="openSection.gawty"
            :class="openSection.gawty==true ? 'fader' : 'none'"
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
        </section>
        <!-- / コンテンツ -->
      </div>
      <!-- / WRAPPER -->

      <!-- リロード確認ダイアログ -->
      <dialog-frame-normal :target="confirmReloadDialog" :title="'リロード確認'" :contents="'画面の再読み込みをします。よろしいですか？'">
        <v-btn @click="doReload" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
        <v-btn @click="confirmReloadDialog = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
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
            palette: colorPalette,
            viewCountNull: false,
            confirmReloadDialog: false,
            openSection: {
              message: true,
              login: false,
              search: false,
              gawty: false,
              note: false,
              noteInto: false,
              video: false,
              videoInto: false,
            },
            styles: {
              linkerLogoBtn: "cursor: pointer; border: 3px solid #f1a753; border-radius: 5px;",
              teacherBadge:
                'border: 2px solid orange;border-radius: 5px;background: yellow;padding: 5px;color: red;font-weight: 600;font-size: 12px;margin-right:2px;',
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
            delete this.client.validationflg;
            delete this.client.insertUpdate;
            console.log('init.client', this.client);
          },
          openMessage() {
            this.resetOpenAreas();
          },
          openLogin() {
            this.resetOpenAreas();
            this.openSection.message = false;
            this.openSection.login = true;
          },
          openSearch() {
            this.resetOpenAreas();
            this.openSection.message = false;
            this.openSection.search = true;
          },
          doSearch() {
            if(this.client.form.search.viewCount == ''){
              this.viewCountNull = true;
              return;
            }
            // gawtyエリアの各ボタンリンクを初期化
            this.gawtyItems = {};
            // ノート・動画一覧を初期化
            this.noteItems = [];
            this.videoItems = [];
            // オープンセクションエリアを初期化
            this.resetOpenSection();
            this.openSection.gawty = true;
            
            let searches = this.client.form.search;
            let data = {
              search_for: 'list', // list:一覧を取得, single:個別のノート・動画を取得
              gawty: searches.gawty,
              created_user: searches.createdUser,
              term_start: searches.term.start,
              term_end: searches.term.end,
              view_count: searches.viewCount,
              note_or_video: searches.which.noteOrVideo,
              and_or: searches.which.andOr,
              title_or_body: searches.which.titleOrBody,
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
          },
          doReload() {
            location.reload();
          },
          resetOpenSection(){
            // 検索時の個別エリアを初期化する
            this.openSection = {
              search: true,
              gawty: false,
              note: false,
              noteInto: false,
              video: false,
              videoInto: false,
            };
          },
          resetOpenAreas() {
            // 画面の表示を画面遷移時の状態に戻す
            client.method.reset_input();
            this.openSection = {
              message: true,
              login: false,
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
          loginAxios(){
            // パスワードの形式が正しいかを判定する（不正ならば処理を打ち切る）
            let regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9.?/-]{6,16}$/);
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
                if(response.data == 1){
                  this.loginJudge = "success";
                  setTimeout(function(){
                    location.href = "../ownMyPage/index.php";
                  }, 3000);
                }else if(response.data == -1){
                  this.loginJudge = "stopped";
                }else{
                  this.loginJudge = "fail";
                };
              }).catch(error => alert("通信に失敗しました。"));
          },
        },
      });
    </script>
  </body>
</html>