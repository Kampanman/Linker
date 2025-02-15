/**
 * コンポーネント：ノート一覧・ノート本文エリア
 */
import {
  useChangeForAll, useGetJapDateString, useGetRandSecretPhrase, useGetSecretPhrase,
  useGetSimpleDateString, useSetNowDate,
  useSetSelection, useSplitTextByPunctuatedParts
} from './commonMethods/globalFunctions.js';

let noteArea = Vue.component('note-area', {
  template: `<div>
    <card-sec-searched :prop="'note'">
      <template #title><tag-title>該当ノート</tag-title></template>
      <template #contents>
        <div align="center" v-if="noteItems.length < 1">
          <span>該当ノートが検出されませんでした。<br />代わりにですが、こちらのノート、どうでしょう？</span><br /><br />
        </div>
        <section align="center" v-if="noteItems.length < 1" id="noteIndex">
          <v-btn
            v-if="!noAppearingNotes"
            id="view_note_1"
            :style="styles.viewButton"
            data-id="1"
            data-which="note"
            @click="getThisDataId($event)">表示</v-btn>
        </section>
        <section v-else id="noteIndex"><br />
          <p v-for="item of noteItems" style="display:inline-block;margin-bottom:10px;">
            <span :style="styles.teacherBadge" v-if="item.is_teacher==1">講</span>
            <span v-if="item.url==''" :id="'note_'+item.id">{{ item.title }}</span>
            <span v-else :id="'note_'+item.id">
              <a :href="item.url" style="color:cornflowerblue" target="_blank">{{ item.title }}</a>
            </span>
            <v-btn
              v-if="!noAppearingNotes"
              :id="'view_note_'+item.id"
              :style="styles.viewButton"
              :data-id="item.id"
              data-which="note"
              @click="getThisDataId($event)">表示</v-btn>
            <span v-if="item.last==0" style="margin-left:10px;margin-right:10px;"> / </span>
          </p>
        </section>
      </template>
    </card-sec-searched>

    <div v-if="openSection.noteInto" :class="openSection.noteInto==true ? 'fader' : 'none'">
      <card-sec-searched :prop="'noteInner'">
        <template #title><tag-title>ノートの詳細</tag-title></template>
        <template #contents>
          <div style="margin-bottom:0.5em" v-if="articlableFlg==true" align="center">
            <br /><v-btn :style="client.palette.brownFront" @click="newTabConfirmDialog=true">Linker Article で表示</v-btn>
          </div>
          <div :style="styles.alignItem" align="right">
            <label><b>ガチャ動画 </b></label>
            <v-btn v-if="gachaVideo==false" :style="client.palette.redBack" @click="openGachaVideo">非表示</v-btn>
            <v-btn v-if="gachaVideo==true" :style="client.palette.redFront" @click="closeGachaVideo">表示</v-btn>
          </div><br />
          <div :style="styles.widthFlex + styles.alignItem">
            <div style="margin-right:10px;margin-bottom:10px;"><label><b>登録者: </b></label><span>{{ noteDetail.author }}</span></div>
            <div style="margin-right:10px;margin-bottom:10px;">
              <v-btn v-if="allToggle==1" :style="client.palette.brownFront" @click="doDownload($event,'normal')">ノートをダウンロード</v-btn>
              <v-btn v-if="allToggle==0" :style="client.palette.brownFront" @click="doDownload($event,'part')">ノートをダウンロード（部分出力）</v-btn>
            </div>
            <div style="margin-bottom:10px;">
              <label><b>表示一括切替 </b></label>
              <v-btn v-if="allToggle==0" :style="client.palette.blueFront" @click="allOn">ON</v-btn>
              <v-btn v-if="allToggle==1" :style="client.palette.blueBack" @click="allOff">OFF</v-btn>
            </div>
          </div>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label>
            <span v-if="noteDetail.url==''">{{ noteDetail.title }}</span>
            <span v-else><a :href="noteDetail.url" style="color:cornflowerblue" target="_blank">{{ noteDetail.title }}</a></span>
          </div><br />
          <div :style="styles.alignItem">
            <label><b>最終更新: </b></label><span id="updatedDate">{{ noteDetail.updated }}</span>
            <span>　<b>（</b></span>
            <label><b>初回登録: </b></label><span id="createdDate">{{ noteDetail.created }}</span>
            <span><b>）</b></span>
          </div><br />
          <p align="center" class="aboutHighlight">
            キーワード入力欄に入力されている文字が含まれるラインが<br />
            ブルーにハイライトされます<br />
            （複数のキーワードを半角空白で繋いでいる場合は無効です）
          </p><br />
          <div align="center" class="blankNoteButton">
            <v-btn :style="client.palette.brownFront" @click="viewBlankNoteArea($event)">虫食いノートをつくる</v-btn>
          </div>
          <div align="right" style="margin: 10px 5px; align-items: center;">
            <label><b>ON時出力 </b></label>
            <v-btn v-if="viewTypeToggle==0" :style="client.palette.greenBack" @click="noAppearingConfirmDialog = true">全文</v-btn>
            <v-btn v-if="noAppearingNotes && viewTypeToggle==1" :style="client.palette.yellowFront" @click="viewTypeToggle=2">一文字ずつ（普通）</v-btn>
            <v-btn v-if="noAppearingNotes && viewTypeToggle==2" :style="client.palette.orangeFront" @click="viewTypeToggle=3">一文字ずつ（速い）</v-btn>
            <v-btn v-if="noAppearingNotes && viewTypeToggle==3" :style="client.palette.redFront" @click="viewTypeToggle=1">文節ごとに</v-btn>
          </div><br />
          <div :style="styles.alignItem">
            <ul class="noteUl">
              <li style="list-style: none;" v-for="(parts, i) of noteDetail.bodyArray">
                <span v-if="parts.trim().length > 0 && rowButtonHidden==false"
                  :id="'on_'+(i+1)"
                  :data-id="(i+1)"
                  :style="client.palette.blueFront + toggleBadgeStyle"
                  @click="forOn($event)"> ON </span>
                <span v-if="parts.trim().length > 0 && rowButtonHidden==false"
                  :id="'off_'+(i+1)"
                  :data-id="(i+1)"
                  :style="client.palette.blueBack + toggleBadgeStyle"
                  @click="forOff($event)"> OFF </span>
                <span 
                  :id="'line_'+(i+1)" 
                  class="lines visible"
                  :style="(client.form.search.gawty != '' 
                    && client.form.search.gawty.indexOf(' ') == -1
                    && parts.indexOf(client.form.search.gawty)>-1
                  ) ? styles.textEnhance : ''"
                >{{ parts }}</span>
              </li>
            </ul>
          </div>
          <br />
          <div :style="styles.alignItem" align="center" v-if="gachaVideo==true" :class="blankNoteArea==true ? 'fader' : 'none'">
            <div :style="styles.alignItem"><span style="fontWeight:700; font-size:1.5em">＝＝ ガチャ動画 ＝＝</span></div>
            <div :style="styles.alignItem" style="width:90%" :align="widthAlign">
              <label><b>タイトル： </b></label><span v-text="videoDetail.title"></span><br />
              <label><b>登録タグ： </b></label><span v-text="videoDetail.tags"></span>
            </div>
            <div :style="styles.alignItem" style="width:90%" id="gachaV_area">
              <iframe :width="frameSize.width" :height="frameSize.height" 
                :src="videoDetail.url.replace('watch?v=','embed/')"
                title="YouTube video player"
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
              </iframe>
            </div>
          </div>
        </template>
      </card-sec-searched>
    </div>

    <div v-if="blankNoteArea" :class="blankNoteArea==true ? 'fader' : 'none'">
      <card-sec>
        <template #title><tag-title>虫食いノート</tag-title></template><br />
        <template #contents>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label>
            <span v-if="noteDetail.url==''">{{ noteDetail.title }}</span>
            <span v-else><a :href="noteDetail.url" style="color:cornflowerblue" target="_blank">{{ noteDetail.title }}</a></span>
          </div><br />
          <div :style="styles.alignItem">
            <v-app><v-textarea outlined label="虫食いノート本文" v-model="blankNoteText"></v-textarea></v-app>
          </div>
          <div align="center">
            <label style="margin-right:1em;"><b>選択した部分</b></label>
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'ランダムに秘匿する'" @click="toSecretRandom()"></v-btn>
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'シンプルに秘匿する'" @click="toSecretSimple()"></v-btn>
          </div><br />
          <div align="center">
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'ノートをダウンロード'" @click="mushikuiDl()"></v-btn>
          </div>
        </template>
      </card-sec>
    </div>

    <!-- 記事画面表示確認モーダルダイアログ -->
    <dialog-frame-normal :target="newTabConfirmDialog" :title="'記事画面表示確認'" :contents="'表示されているノートを記事画面で表示してもよろしいですか？'">
      <v-btn :style="client.palette.brownFront" v-text="client.phrase.button.do" @click="sendForArticle()"></v-btn>
      <v-btn @click="newTabConfirmDialog = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- ノート表示不可確認モーダルダイアログ -->
    <dialog-frame-normal :target="noAppearingConfirmDialog" :title="'ノート選択不能化確認'" :contents="'現在選択されているノートから表示を切り替えられなくなります。よろしいですか？（再検索することで解除されます）'">
      <v-btn :style="client.palette.brownFront" v-text="client.phrase.button.do" @click="changeFornoAppearingNotes()"></v-btn>
      <v-btn @click="noAppearingConfirmDialog = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      allToggle: 1,
      viewTypeToggle: 0,
      noAppearingNotes: false,
      rowButtonHidden: false,
      articlableFlg: false,
      blankNoteArea: false,
      blankNoteText: '',
      client: this.cl,
      frameSize: { width: 560, height: 315 },
      gachaVideo: false,
      newTabConfirmDialog: false,
      noAppearingConfirmDialog: false,
      noteItems: this.items,
      noteDetail: '',
      openSection: this.sec,
      styles: this.stl,
      toggleBadgeStyle:
        'cursor:pointer;margin-right:5px;padding-left:5px;padding-right:5px;' +
        'border-radius:5px;user-select:none;',
      videoDetail: {},
      widthAlign: 'center',
    };
  },
  created: function () {
    this.init();
  },
  props: ['cl', 'sec', 'stl', 'items'],
  methods: {
    // 画面初期表示処理
    async init() {
      this.judgeArticlable();
    },
    judgeArticlable() {
      if (this.client.form.auth.loginID != '') this.articlableFlg = true;
    },
    getThisDataId(event) {
      let parentEl = event.target.parentElement;
      let dataId = parentEl.dataset.id;
      let data = {
        search_for: 'single', // list:一覧を取得, single:個別のノート・動画を取得
        id: dataId,
        which: parentEl.dataset.which,
      };
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/searchGetter.php', params, this.headerObject)
        .then(response => {
          let noteResult = response.data.result.note[0];
          let reCreated = noteResult.created.substring(0, noteResult.created.indexOf(' '));
          let reUpdated = noteResult.updated.substring(0, noteResult.updated.indexOf(' '));
          this.noteDetail = {
            title: noteResult.title,
            url: noteResult.url,
            author: noteResult.author,
            created: reCreated,
            updated: reUpdated,
          };
          this.noteDetail.bodyArray = [];
          let arrayParts = noteResult.note.split('\n');
          arrayParts.forEach(e => this.noteDetail.bodyArray.push(e));
          this.openSection.noteInto = false;
          this.openSection.noteInto = true;
        })
        .then(e => {
          // ノートの詳細エリアの各種切替ボタンで使われるフラグを初期化する
          this.gachaVideo = false;
          this.allToggle = 1;
          this.viewTypeToggle = 0;

          let lines = document.querySelectorAll('.lines');
          lines.forEach(line => {
            line.style.opacity = 1;
            line.classList.add('visible');
            
            const startRegex = /^(☆|【)/;
            const endRegex = /(☆|】)$/;
            const startRoundRegex = /^●[^ _\/\\\$\%]{1,5}/;
            if (
              (startRegex.test(line.innerText) && endRegex.test(line.innerText)) ||
              startRoundRegex.test(line.innerText)
            ) {
              line.style.fontWeight = '700';
              line.parentElement.style.marginTop = '1em';
            }
          });
        })
        .catch(error => alert('通信に失敗しました。'));

      if (window.innerWidth >= 480) {
        this.styles.widthFlex = 'display:flex;justify-content: space-between;';
      } else {
        this.styles.widthFlex = 'display:block;justify-content: space-between;';
      }
    },
    forOff(event) {
      let targetId = event.target.dataset.id;
      document.getElementById('line_' + targetId).style.opacity = 0;
      document.getElementById('line_' + targetId).classList.remove('visible');
      document.getElementById('line_' + targetId).classList.add('invisible');
      this.allToggle = 0;
    },
    forOn(event) {
      let targetRow = document.getElementById('line_' + event.target.dataset.id);
      let rowTextArray = [];

      if (this.viewTypeToggle > 0) {
        rowTextArray = (this.viewTypeToggle == 3) ?
          this.splitTextArray(targetRow.innerText) : targetRow.innerText.split("");
        targetRow.innerText = "";
      }
      targetRow.style.opacity = 1;
      targetRow.classList.remove('invisible');
      targetRow.classList.add('visible');
      let index = 0;
      if (this.viewTypeToggle > 0) {
        this.rowButtonHidden = true;
        if (this.viewTypeToggle == 1) {
          this.typeTextInterval(targetRow, index, rowTextArray, 0.08);
        } else if (this.viewTypeToggle == 2) {
          this.typeTextInterval(targetRow, index, rowTextArray, 0.02);
        } else {
          this.typeTextInterval(targetRow, index, rowTextArray, 0.4);
        }
      }
      const invisibles = Array.from(document.querySelectorAll('.invisible'));
      if(invisibles.length==0) this.allToggle = 1;
    },
    typeTextInterval(targetRow, index, rowTextArray, sec) {
      // 元のフォントカラーと太さを保存し、violet色に変更
      let originalColor = targetRow.style.color;
      targetRow.style.color = 'violet';
      let originalWeight = targetRow.style.fontWeight;
      targetRow.style.fontWeight = 600;
      
      /**
       * setInterval使うと変数の参照先が変化するとかどうとかで、function(){ ~ }のままでは使えないらしい。
       * その為、function(){ ~ }ではなくてアロー関数を使う必要がある。
       */
      let addFunction = setInterval(() => { 
        targetRow.innerText += rowTextArray[index];
        index++;
        if (index == rowTextArray.length) {
          clearInterval(addFunction);
          setTimeout(() => {
            // 非表示にしていたボタンを再表示する
            this.rowButtonHidden = false;
  
            // 保存していたフォントカラーと太さに戻す
            targetRow.style.color = originalColor;
            targetRow.style.fontWeight = originalWeight;
          }, 1000);
        }
      }, sec * 1000);

      return addFunction;
    },
    changeForAll(num) {
      const target = document.querySelectorAll('.lines');
      return useChangeForAll(target, num);
    },
    allOff() {
      this.allToggle = this.changeForAll(0);
    },
    allOn() {
      this.allToggle = this.changeForAll(1);
    },
    splitTextArray(text) {
      return useSplitTextByPunctuatedParts(text);
    },
    changeFornoAppearingNotes() {
      this.noAppearingNotes = true;
      this.viewTypeToggle = 1;
      this.noAppearingConfirmDialog = false;
    },
    dlFunction(linesClass) {
      // 画面上に表示されている値をセット
      let fileName = this.noteDetail.title;
      let createdDate = document.getElementById('createdDate').innerText;
      let updatedDate = document.getElementById('updatedDate').innerText;
      let outputText = 'タイトル： ' + fileName + '\n\n';
      outputText += '作成者： ' + this.noteDetail.author + '\n';
      outputText += '初回登録日： ' + createdDate + '\n';
      outputText += '最終更新日： ' + updatedDate + '\n\n';
      let lines = document.querySelectorAll(linesClass);
      lines.forEach(e => (outputText += e.innerText + '\n'));
      outputText += '\n\n取得元サイト： ' + location.href;

      // ファイルのダウンロード
      const now = new Date();
      const blob = new Blob([outputText], { type: 'text/plain' });
      const aTag = document.createElement('a');
      aTag.href = URL.createObjectURL(blob);
      aTag.target = '_blank';
      aTag.download = fileName + '_' + this.getSimpleDateString();
      aTag.click();
      URL.revokeObjectURL(aTag.href);
    },
    doDownload(event, type) {
      try {
        const linesClass = (type=='part') ? '.visible' : '.lines';
        this.dlFunction(linesClass);
        event.target.parentElement.style.display = 'none';
      } catch (e) {
        console.log(e.message);
      }
    },
    viewBlankNoteArea(event) {
      this.openSection.noteInto = false;
      this.blankNoteArea = true;
      this.blankNoteText = '';
      let linesArray = [];
      document.querySelectorAll('.visible').forEach((item) => linesArray.push(item.innerText) );
      this.blankNoteText = linesArray.join('\n');
    },
    setSelection() {
      const textarea = document.querySelector('textarea');
      const selectionObject = useSetSelection(textarea);
      return selectionObject;
    },
    getSecretPhrase(selection) {
      return useGetSecretPhrase(selection);
    },
    toSecretSimple() {
      const selection = this.setSelection();
      this.blankNoteText = this.getSecretPhrase(selection);
    },
    getRandSecretPhrase(selection) {
      return useGetRandSecretPhrase(selection);
    },
    toSecretRandom() {
      const selection = this.setSelection();
      this.blankNoteText = this.getRandSecretPhrase(selection);
    },
    mushikuiDl() {
      try {
        // 画面上に表示されている値をセット
        let fileName = this.noteDetail.title;
        let outputText = 'タイトル： ' + fileName + '\n\n';
        outputText += '＝ ノート本文 ＝' + '\n\n';
        outputText += this.blankNoteText + '\n\n';

        // 出力日時を設定
        outputText += '出力日時： ' + this.getJapDateString() + '\n';
        outputText += '取得元サイト： ' + location.href;
        
        // ファイルのダウンロード
        const blob = new Blob([outputText], { type: 'text/plain' });
        const aTag = document.createElement('a');
        aTag.href = URL.createObjectURL(blob);
        aTag.target = '_blank';
        aTag.download = fileName + '_' + this.getSimpleDateString();
        aTag.click();
        URL.revokeObjectURL(aTag.href);
      } catch (e) {
        console.log(e.message);
      }
    },
    getSimpleDateString() {
      const dateObject = this.getNowDate();
      return useGetSimpleDateString(dateObject);
    },
    getJapDateString() {
      const dateObject = this.getNowDate();
      return useGetJapDateString(dateObject);
    },
    getNowDate() {
      return useSetNowDate();
    },
    openGachaVideo() {
      let data = { search_for: 'gachavideo' };
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/gachaVideoGetter.php', params, this.headerObject)
        .then(response => {
          this.videoDetail.title = response.data.result.video[0].title;
          this.videoDetail.tags = response.data.result.video[0].tags;
          this.videoDetail.url = response.data.result.video[0].url;
        })
        .then(response => {
          try {
            if (window.innerWidth <= 400) {
              this.styles.widthFlex = 'display:block;justify-content: space-between;';
              this.frameSize.width = window.innerWidth - 80;
              this.widthAlign = 'left';
            } else {
              this.widthAlign = 'center';
            }
            this.frameSize.height = (this.frameSize.width * 9) / 16;
            this.gachaVideo = true;
          } catch (e) {
            alert('通信に失敗しました。');
          }
        });
    },
    closeGachaVideo() {
      this.gachaVideo = false;
    },
    sendForArticle() {
      // 架空のformを生成
      var form = document.createElement('form');
      form.action = './currentArticle.php';
      form.method = 'POST';
      form.target = '_blank';

      // 一時的にbodyに追加
      document.body.append(form);
      
      // formdta イベントに関数を登録(submit する直前に発火)
      form.addEventListener('formdata', (e) => {
        var fd = e.formData;
        let linesArray = [];
        document.querySelectorAll('.visible').forEach((item)=>{
          linesArray.push(item.innerText);
        });
        fd.set('title', this.noteDetail.title);
        fd.set('text_array', linesArray.join('<br>'));
        fd.set('time', this.getJapDateString());
      });

      // submit
      form.submit();
      // formを画面から除去
      form.remove();
      // 確認モーダルを閉じる
      this.newTabConfirmDialog = false;
    }
  },
});

export default noteArea;
