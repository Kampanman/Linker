<?php
if (!isset($_POST["login_id"]) || !isset($_POST["is_teacher"])) {
  // 当ページは表示せず個別マイページに遷移
  header('Location: ../commonPage/index.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, user-scalable=yes, maximum-scale=1.0, minimum-scale=1.0" />
  <meta name="description" content="Linker | アーカイブス検索ページ" />
  <meta name="keywords" content="" />
  <title>Linker | アーカイブス検索ページ</title>
  <link rel="icon" href="../../images/favicon.ico">
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" />
  <style scoped>
    body {
      background: #e8d3c7;
      color: #4c4c4c;
      font: 17px verdana, "yu gothic", "YuGothic", "hiragino kaku gothic pron", "メイリオ", "Meiryo", "sans-serif";
      line-height: 2em;
    }

    #vueForArchive>div {
      padding: 5px;
    }

    #header {
      padding: 10px 0 15px;
      overflow: hidden;
      background: #73675e;
    }

    .inner {
      margin: 0 auto;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      padding: 20px 0 0;
      text-align: center;
    }

    .logo a {
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
      color: #fff;
    }

    .logo span {
      font-size: 12px;
      font-weight: normal;
    }

    .dispNone {
      display: none
    }

    .fader {
      animation-name: fadeInAnime;
      animation-duration: 1s;
    }

    td,
    th {
      vertical-align: middle;
      /* 中央揃え */
    }

    textarea {
      margin-bottom: 0.3em;
      margin-right: 0.3em;
    }

    .widthFlex {
      align-items: center;
      margin: 5px;
    }

    .text-start {
      text-align: left
    }

    .v-application--wrap {
      min-height: 0vh;
      background-color: rgb(239, 235, 222);
    }

    .noteEditContainer>div>.v-application--wrap {
      min-height: 0vh;
      background-color: rgb(113, 244, 244);
    }

    .dialog>div>.v-application--wrap {
      display: none;
    }

    article.areaContents {
      font-size: 16px
    }

    @keyframes fadeInAnime {
      from {
        opacity: 0
      }

      to {
        opacity: 1;
      }
    }

    @media only screen and (min-width:960px) {
      .inner {
        width: 80%;
        padding: 0;
      }

      .widthFlex {
        display: flex;
      }
    }

    /* モニター幅940px以下 */
    @media only screen and (max-width:940px) {
      .logo {
        padding-left: 10px;
      }
    }

    /* iPad 縦 */
    @media only screen and (max-width:768px) {
      .logo {
        float: none;
        text-align: center;
        padding: 10px 5px 20px;
      }
    }
  </style>
</head>

<body>
  <!-- Vue Area -->
  <div id="vueForArchive">

    <!-- ヘッダー -->
    <div id="header">
      <div class="inner">
        <div class="logo">
          <img src="../../images/linker_logo.png" alt="" width="240" height="80" :style="styles.linkerLogoBtn" />
          <h2 style="color:chocolate">Archives & Progresses</h2>
        </div>
      </div>
    </div>

    <div id="wrapper">
      <!-- コンテンツ -->
      <section id="main" class="inner fader">
        <div id="csvTableArea">
          <table-csv :session="accountInfo" @selected-csv="getCsv"></table-csv>
        </div>
        <div id="requestArea">
          <form name="user_info">
            <input type="hidden" name="login_id" value="<?php echo $_POST["login_id"] ?>">
            <input type="hidden" name="account_id" value="<?php echo $_POST["account_id"] ?>">
            <input type="hidden" name="is_teacher" value="<?php echo $_POST["is_teacher"] ?>">
          </form>
          <form name="selected_file">
            <input type="hidden" name="filename">
          </form>
          <br />
          <card-sec>
            <template #title><tag-title>検索フォーム</tag-title></template>
            <template #contents>
              <div v-if="csv_selected!=true" id="nonSelected" align="center">
                <p><b>一覧エリアからCSVファイルを選択してください</b></p>
              </div>
              <div v-else id="selected" :class="(csv_selected!=true) ? 'none' : 'fader'">
                <csv-search-inner :session="accountInfo" :color="palette" @search-condition="getSearchCondition">
                  <div align="center" v-if="openSection.linknote==true || openSection.linkvideo==true">
                    <v-btn class="fader" v-if="openSection.linknote" :style="palette.blueFront" @click="editNoteDetail">ノートを編集する</v-btn>
                    <v-btn class="fader" v-if="openSection.linkvideo" :style="palette.blueFront" @click="editVideoDetail">動画を編集する</v-btn>
                  </div>
                  <div align="center" v-else>
                    <br />
                    <v-btn class="fader" v-if="openSection.allview" :style="palette.orangeFront" @click="doAllview">公開・自登録分を表示</v-btn>
                  </div>
                </csv-search-inner>
              </div>
            </template>
          </card-sec>
        </div>
        <div id="responseArea">
          <div id="allViewArea" v-if="openSection.showAllAtOnce" :class="openSection.showAllAtOnce==true ? 'fader' : 'none'">
            <table-csv-inner :session="accountInfo" :palette="palette" :file="filename" @select-one="getThisNoteFromInner"></table-csv-inner>
          </div>
          <div id="noteArea" v-if="openSection.note && (!openSection.linknote_edit && !openSection.linkvideo_edit)"
            :class="openSection.note==true ? 'fader' : 'none'">
            <csv-note-area
              :stl="styles" :session="accountInfo" :palette="palette" :items="csvItems" :searched="searchword"
              @note-detail="getNoteDetail"></csv-note-area>
          </div>
          <div id="videoArea" v-if="openSection.video && (!openSection.linknote_edit && !openSection.linkvideo_edit)"
            :class="openSection.video==true ? 'fader' : 'none'">
            <csv-video-area
              :stl="styles" :session="accountInfo" :palette="palette" :items="csvItems" @video-detail="getVideoDetail"></csv-video-area>
          </div>
          <div id="linknoteEditArea" v-if="openSection.linknote_edit" :class="openSection.linknote_edit==true ? 'fader' : 'none'">
            <csv-editnote-area :stl="styles" :session="accountInfo" :palette="palette" :items="noteDetail"></csv-editnote-area>
          </div>
          <div id="linkvideoEditArea" v-if="openSection.linkvideo_edit" :class="openSection.linkvideo_edit==true ? 'fader' : 'none'">
            <csv-editvideo-area :stl="styles" :session="accountInfo" :palette="palette" :items="videoDetail"></csv-editvideo-area>
          </div>
        </div>
      </section>
    </div>
  </div>
  <!-- Vue Area -->

  <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
  <!-- ↓ 非同期通信を実行するために必要 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
  <script src="../../static/js/JQ01_gotoTop.js"></script>
  <script type="module">
    import colorPalette from '../../static/js/VJ04_colorPalette.js';
    import cardSection from '../../static/js/VJCP_cardSection.js';
    import cardSectionAfterSearch from '../../static/js/VJCP_cardSectionAfterSearch.js';
    import tagTitle from '../../static/js/VJCP_tagTitle.js';
    import searchFormInner from '../../static/js/VJCP_searchFormInner.js';
    import csvNoteArea from '../../static/js/archivesProgress/VJCP_csvNoteArea.js';
    import csvEditNoteArea from '../../static/js/archivesProgress/VJCP_csvEditNoteArea.js';
    import csvEditVideoArea from '../../static/js/archivesProgress/VJCP_csvEditVideoArea.js';
    import csvVideoArea from '../../static/js/archivesProgress/VJCP_csvVideoArea.js';
    import dataTableForCsv from '../../static/js/archivesProgress/VJCP_dataTableForCsv.js';
    import dataTableForCsv_inner from '../../static/js/archivesProgress/VJCP_dataTableForCsv_inner.js';
    import dialogFrameNormal from '../../static/js/VJCP_dialogFrameNormal.js';
    import csvSearchFormInner from '../../static/js/archivesProgress/VJCP_csvSearchFormInner.js';

    // #vueForArchive内でVue.jsの機能を有効化する
    const archive = new Vue({
      el: '#vueForArchive',
      vuetify: new Vuetify(),
      data: function() {
        return {
          accountInfo: {
            login_id: document.forms.user_info.login_id.value,
            account_id: document.forms.user_info.account_id.value,
            is_teacher: document.forms.user_info.is_teacher.value,
          },
          csv_selected: false,
          filename: "",
          searchword: "",
          word_request: {
            which: "note",
            word: "",
            start_date: "",
            end_date: "",
            limit: 10,
          },
          openSection: {
            allview: false,
            showAllAtOnce: false,
            note: false,
            video: false,
            renote: false,
            linknote: false,
            linkvideo: false,
            linknote_edit: false,
            linkvideo_edit: false,
          },
          csvItems: [],
          noteDetail: [],
          videoDetail: [],
          styles: {
            linkerLogoBtn: "cursor: pointer; border: 3px solid #f1a753; border-radius: 5px;",
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
            flexAlign: 'display:flex;align-items:center;',
            m5px: 'margin: 5px;',
            ntf: 'text-transform: none;',
          },
          palette: colorPalette,
        };
      },
      created: function() {
        this.init();
      },
      methods: {
        // 画面初期表示処理
        async init() {
          // 
        },
        csvContentsLoadAxios() {
          let data = {
            type: "index",
            account_id: this.accountInfo.account_id,
            is_teacher: this.accountInfo.is_teacher,
            filename: this.filename,
            which: this.word_request.which,
            word: this.word_request.word,
            start_date: this.word_request.start_date,
            end_date: this.word_request.end_date,
            limit: this.word_request.limit,
          };

          let params = new URLSearchParams();
          Object.keys(data).forEach(function(key) {
            params.append(key, this[key]);
          }, data);

          axios
            .post('../../server/api/getArrayFromCsv.php', params, this.headerObject)
            .then(response => {
              this.csvItems = response.data;
              (response.data.type != "videos") ? this.openSection.note = true: this.openSection.video = true;
            }).catch(error => alert("通信に失敗しました。"));
        },
        getThisNoteFromInner(item) {
          let params = new URLSearchParams();
          Object.keys(item).forEach(function(key) {
            params.append(key, this[key]);
          }, item);

          axios
            .post('../../server/api/getArrayFromCsv.php', params, this.headerObject)
            .then(response => {
              let contents = response.data.contents;
              contents = this.contentsInItem(contents, item);
              if (contents.type == "note") {
                let prog_bool = contents.filename.indexOf("progress") > -1;
                prog_bool ? contents.mode = 2 : contents.mode = 1;
                this.noteDetail = contents;
                this.openSection.linknote_edit = true;
              } else {
                this.videoDetail = contents;
                this.openSection.linkvideo_edit = true;
              }
            })
            .catch(error => alert('通信に失敗しました。'));
        },
        contentsInItem(contents, item) {
          contents.filename = item.filename;
          if (contents.created_at != "") {
            let re_create_at = contents.created_at.replace(/ \d{2}:\d{2}:\d{2}/g, '');
            contents.created_at = re_create_at;
          }
          if (item.which == "note") {
            contents.type = "note";
            let bodyArray = contents.note.split('\\n');
            let trim_first = bodyArray[0].replace('"', '');
            bodyArray[0] = trim_first;
            let last = bodyArray.length - 1;
            let trim_last = bodyArray[last].replace('"', '');
            bodyArray[last] = trim_last;
            let re_bodyArray = [];
            let prog_bool = item.filename.indexOf("progress") > -1;
            bodyArray.forEach(function(line, i) {
              let new_line;
              if (prog_bool) {
                new_line = line.replaceAll('\\r', '');
              } else {
                new_line = line.replaceAll('\\r', '').replaceAll(/link?_\((.*)\)/g, '');
              }
              re_bodyArray.push(new_line);
            });
            contents.bodyArray = re_bodyArray;
            contents.note = "";
          } else {
            contents.type = "video";
            let removedTags = contents.tags.replaceAll('\"', '').replaceAll('\\', '');
            contents.tags = removedTags;
          }

          return contents;
        },
        doAllview() {
          this.openSection.allview = false;
          this.openSection.showAllAtOnce = true;
        },
        getCsv(item) {
          this.filename = item;
          this.csv_selected = true;
        },
        getSearchCondition(item) {
          if (item.searchword != "") {
            this.searchword = item.searchword;
            this.csvItems = [];
            this.openSection.allview = true;
            this.openSection.showAllAtOnce = false;
            this.openSection.note = false;
            this.openSection.video = false;
            this.openSection.linknote = false;
            this.openSection.linkvideo = false;
            this.openSection.linknote_edit = false;
            this.openSection.linkvideo_edit = false;
            this.word_request.which = item.which;
            this.word_request.word = item.searchword;
            this.word_request.start_date = item.start_date;
            this.word_request.end_date = item.end_date;
            this.word_request.limit = item.view_count;
            this.csvContentsLoadAxios();
          }
        },
        getNoteDetail(item) {
          this.noteDetail = item;
          this.openSection.linknote = true;
        },
        getVideoDetail(item) {
          this.videoDetail = item;
          this.openSection.linkvideo = true;
        },
        editNoteDetail() {
          this.openSection.linknote = false;
          this.openSection.linknote_edit = true;
        },
        editVideoDetail() {
          this.openSection.linkvideo = false;
          this.openSection.linkvideo_edit = true;
        }
      }
    });
  </script>
</body>

</html>