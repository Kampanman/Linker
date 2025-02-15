/**
 * コンポーネント：登録CSV用ノート一覧・ノート本文エリア
 */
import {
  useChangeForAll, useGetJapDateString, useGetRandSecretPhrase, useGetSecretPhrase,
  useGetSimpleDateString, useSetNowDate, useSetSelection, useSplitTextByPunctuatedParts
} from '../commonMethods/globalFunctions.js';

let csvNoteArea = Vue.component('csv-note-area', {
  template: `<div>
    <card-sec-searched :prop="'note'">
      <template #title><tag-title>該当ノート</tag-title></template>
      <template #contents>
        <section align="center" v-if="noteItems.length < 1">
          <span>該当ノートが検出されませんでした。</span>
        </section>
        <section v-else id="noteIndex"><br />
          <p align="center">全 {{ noteItems.total }} 中 {{ noteItems.count }} 件がヒットしました</p><br />
          <p v-for="item of noteItems.contents" style="display:inline-block;margin-bottom:10px;">
            <span v-if="item.url==''" :id="'note_'+item.id">{{ item.title }}</span>
            <span v-else :id="'note_'+item.id">
              <a :href="item.url" style="color:cornflowerblue" target="_blank">{{ item.title }}</a>
            </span>
            <v-btn
              v-if="!noAppearingNotes"
              :id="'view_note_'+item.id"
              :style="item.id.indexOf('lin')>-1 ? styles.viewButton_lin : styles.viewButton"
              :data-id="item.id"
              :data-publicity="item.publicity"
              data-which="note"
              @click="getThisNoteId($event, 1)">表示</v-btn>
            <span style="margin-left:10px;margin-right:10px;"> / </span>
          </p>
        </section>
      </template>
    </card-sec-searched>

    <div v-if="openSection_dlnote" :class="openSection_dlnote==true ? 'fader' : 'none'">
      <card-sec-searched>
        <template #title><tag-title>ノートの詳細</tag-title></template>
        <template #contents>
          <div style="margin-bottom:0.5em" align="center">
            <br /><v-btn :style="colorPalette.brownFront" @click="newTabConfirmDialog=true">Linker Article で表示</v-btn>
          </div>
          <div style="margin-bottom:0.5em" align="right">
            <label><b>出力モード </b></label>
            <v-btn v-if="scopeMode.active==false"
              :style="colorPalette.purpleBack"
              @click="preActivateScopeMode()">一般出力</v-btn>
            <v-btn v-else
              :style="colorPalette.purpleFront"
              @click="scopeMode.active=false">範囲出力</v-btn>
          </div>
          <div :style="styles.widthFlex + styles.alignItem">
            <div style="margin-right:10px;margin-bottom:10px;" v-if="scopeMode.active==true"><br />
              <v-btn :style="colorPalette.brownBack" @click="doScopeDownload($event)">ノートをダウンロード（範囲出力）</v-btn>
            </div>
            <div style="margin-right:10px;margin-bottom:10px;" v-else><br />
              <v-btn v-if="allToggle==1" :style="colorPalette.brownFront" @click="doDownload($event,'normal')">ノートをダウンロード</v-btn>
              <v-btn v-if="allToggle==0" :style="colorPalette.brownFront" @click="doDownload($event,'part')">ノートをダウンロード（部分出力）</v-btn>
            </div>
            <div style="margin-bottom:10px;" v-if="scopeMode.active==false">
              <label><b>表示一括切替 </b></label>
              <v-btn v-if="allToggle==0" :style="colorPalette.blueFront" @click="allOn">ON</v-btn>
              <v-btn v-if="allToggle==1" :style="colorPalette.blueBack" @click="allOff">OFF</v-btn>
            </div>
          </div>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label>
            <span v-if="noteDetail.url==''">{{ noteDetail.title }}</span>
            <span v-else><a :href="noteDetail.url" style="color:cornflowerblue" target="_blank">{{ noteDetail.title }}</a></span>
            <v-btn
              v-if="note_progress==true"
              :style="'margin:5px;' + colorPalette.blueFront"
              :data-id="noteDetail.id"
              data-which="note"
              @click="getThisNoteId($event, 2)">リンク付ノートを表示</v-btn>
          </div>
          <div :style="styles.alignItem"><label><b>登録日: </b></label>{{ noteDetail.created_at }}</div><br />
          <p align="center" class="aboutHighlight">
            キーワード入力欄に入力されている文字が含まれるラインが<br />
            ブルーにハイライトされます<br />
            （複数のキーワードを半角空白で繋いでいる場合は無効です）
          </p><br />
          <div align="center" class="blankNoteButton">
            <v-btn :style="colorPalette.brownFront" @click="viewBlankNoteArea($event)">虫食いノートをつくる</v-btn>
          </div>
          <div align="right" style="margin: 10px 5px; align-items: center;" v-if="scopeMode.active==false">
            <label><b>ON時出力 </b></label>
            <v-btn v-if="viewTypeToggle==0" :style="colorPalette.greenBack" @click="showNoAppearing()">全文</v-btn>
            <v-btn v-if="noAppearingNotes && viewTypeToggle==1" :style="colorPalette.yellowFront" @click="viewTypeToggle=2">一文字ずつ（普通）</v-btn>
            <v-btn v-if="noAppearingNotes && viewTypeToggle==2" :style="colorPalette.orangeFront" @click="viewTypeToggle=3">一文字ずつ（速い）</v-btn>
            <v-btn v-if="noAppearingNotes && viewTypeToggle==3" :style="colorPalette.redFront" @click="viewTypeToggle=1">文節ごとに</v-btn>
          </div><br />
          <div :style="styles.alignItem">
            <ul class="noteUl">
              <li style="list-style: none;" v-for="(parts, i) of noteDetail.bodyArray">

                <span v-if="scopeMode.active==false && parts.trim().length > 0 && rowButtonHidden==false"
                  :id="'on_'+(i+1)"
                  :data-id="(i+1)"
                  :style="colorPalette.blueFront + toggleBadgeStyle"
                  @click="forOn($event)"> ON </span>
                <span v-if="scopeMode.active==false && parts.trim().length > 0 && rowButtonHidden==false"
                  :id="'off_'+(i+1)"
                  :data-id="(i+1)"
                  :style="colorPalette.blueBack + toggleBadgeStyle"
                  @click="forOff($event)"> OFF </span>
                
                <span v-if="scopeMode.active==true
                  && scopeMode.selecting==false
                  && scopeMode.minSelectableNum <= (i+1)
                  && scopeMode.selectedScopes.indexOf(i+1)==-1"
                  :id="'startscope_'+(i+1)"
                  :data-id="(i+1)"
                  :style="colorPalette.greenFront + toggleBadgeStyle"
                  @click="startScope(i+1)"> 指定開始 </span>
                <span v-if="scopeMode.active==true
                  && scopeMode.selecting==true
                  && scopeMode.minSelectableNum <= (i+1)
                  && scopeMode.startNum < (i+1)
                  && scopeMode.selectedScopes.indexOf(i+1)==-1"
                  :id="'endscope_'+(i+1)"
                  :data-id="(i+1)"
                  :style="colorPalette.redFront + toggleBadgeStyle"
                  @click="endScope(i+1)"> 範囲終了 </span>
                <span v-if="scopeMode.active==true
                  && scopeMode.startNum==(i+1)"
                  :id="'selected_'+(i+1)"
                  :style="colorPalette.yellowFront + toggleBadgeStyle"
                  @click="endScope(i+1)"> 単体選択 </span>
                <span v-if="scopeMode.active==true
                  && scopeMode.selectedScopes.indexOf(i+1)==-1
                  && (
                    (i+1 < scopeMode.startNum && scopeMode.selecting == true)
                    || (i+1 <= scopeMode.minSelectableNum)
                  )"
                  :id="'selected_'+(i+1)"
                  :style="colorPalette.redBack + 'padding:0 0.5em;'">選択不可</span>
                <span v-if="scopeMode.active==true && scopeMode.selectedScopes.indexOf(i+1)>-1"
                  :id="'selected_'+(i+1)"
                  :style="colorPalette.blueBack + 'padding:0 0.5em;'"
                  :data-selectedparts="parts">選択済み</span>
                
                <span :id="'line_'+(i+1)" class="lines visible">{{ parts }}</span>
              </li>
            </ul>
          </div><br />
        </template>
      </card-sec-searched>
    </div>

    <div v-if="openSection_linknote" :class="openSection_linknote==true ? 'fader' : 'none'">
      <card-sec>
        <template #title><tag-title>リンク付ノート</tag-title></template><br /><br />
        <template #contents>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label>
            <span v-if="noteDetail.url==''">{{ noteDetail.title }}</span>
            <span v-else><a :href="noteDetail.url" style="color:cornflowerblue" target="_blank">{{ noteDetail.title }}</a></span>
          </div>
          <div :style="styles.alignItem"><label><b>登録日: </b></label>{{ noteDetail.created_at }}</div><br />
          <div id="linkedNoteArea">
          </div><br />
        </template>
      </card-sec>
    </div>

    <div v-if="blankNoteArea" :class="blankNoteArea==true ? 'fader' : 'none'">
      <card-sec>
        <template #title><tag-title>虫食いノート</tag-title></template><br />
        <template #contents>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label>
            <span v-if="noteDetail.url==''">{{ noteDetail.title }}</span>
            <span v-else><a :href="noteDetail.url" style="color:cornflowerblue" target="_blank">{{ noteDetail.title }}</a></span>
          </div>
          <div :style="styles.alignItem"><label><b>登録日: </b></label>{{ noteDetail.created_at }}</div><br />
          <div :style="styles.alignItem">
            <v-app><v-textarea outlined label="虫食いノート本文" v-model="blankNoteText"></v-textarea></v-app>
          </div>
          <div align="center">
            <label style="margin-right:1em;"><b>選択した部分</b></label>
            <v-btn :style="'margin:5px;' + colorPalette.brownFront" v-text="'ランダムに秘匿する'" @click="toSecretRandom()"></v-btn>
            <v-btn :style="'margin:5px;' + colorPalette.brownFront" v-text="'シンプルに秘匿する'" @click="toSecretSimple()"></v-btn>
          </div><br />
          <div align="center">
            <v-btn :style="'margin:5px;' + colorPalette.brownFront" v-text="'ノートをダウンロード'" @click="mushikuiDl()"></v-btn>
          </div>
        </template>
      </card-sec>
    </div>

    <!-- 記事画面表示確認モーダルダイアログ（Archives & Progressesにも追加） -->
    <dialog-frame-normal :target="newTabConfirmDialog" :title="'記事画面表示確認'" :contents="'表示されているノートを記事画面で表示してもよろしいですか？'">
      <v-btn :style="colorPalette.brownFront" @click="sendForArticle()">実行</v-btn>
      <v-btn @click="newTabConfirmDialog = false" :style="colorPalette.brownBack">キャンセル</v-btn>
    </dialog-frame-normal>

    <!-- ノート表示不可確認モーダルダイアログ -->
    <dialog-frame-normal
      :target="noAppearingConfirmDialog"
      :title="'ノート選択不能化確認'"
      :contents="'現在選択されているノートから表示を切り替えられなくなります。よろしいですか？（再検索することで解除されます）'">
      <v-btn v-if="scopeMode.active==true" :style="colorPalette.brownFront" @click="activateScopeMode()">実行</v-btn>
      <v-btn v-if="scopeMode.active==false" :style="colorPalette.brownFront" @click="changeFornoAppearingNotes()">実行</v-btn>
      <v-btn v-if="scopeMode.active==true" :style="colorPalette.brownBack" @click="cancelActivateScopeMode()">キャンセル</v-btn>
      <v-btn v-if="scopeMode.active==false" :style="colorPalette.brownBack" @click="noAppearingConfirmDialog = false">キャンセル</v-btn>
    </dialog-frame-normal>

  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      allToggle: 1,
      viewTypeToggle: 0,
      scopeMode: {
        active: false,
        selecting: false,
        startNum: 0,
        endNum: 0,
        minSelectableNum: 0,
        selectedScopes: [],
      },
      noAppearingNotes: false,
      rowButtonHidden: false,
      articlableFlg: false,
      blankNoteArea: false,
      blankNoteText: '',
      frameSize: { width: 560, height: 315 },
      newTabConfirmDialog: false,
      noAppearingConfirmDialog: false,
      sessionInfo: this.session,
      noteItems: this.items,
      searched_word: this.searched,
      noteDetail: {},
      toggleBadgeStyle:
        'cursor:pointer;margin-right:5px;padding-left:5px;padding-right:5px;' +
        'border-radius:5px;user-select:none;',
      colorPalette: this.palette,
      openSection_dlnote: false,
      openSection_linknote: false,
      note_progress: false,
      widthAlign: 'center',
      styles: this.stl,
    };
  },
  props: ['stl', 'session', 'palette', 'items', 'searched'],
  methods: {
    getThisNoteId(event, mode) {
      this.returnDefaultThis();
      let parentEl = event.target.parentElement;
      let dataId = parentEl.dataset.id;
      let filename = this.noteItems.path.replace(/(.*).\//g, '');
      let data = {
        type: 'single', // list:一覧を取得, single:個別のノートを取得
        account_id: this.sessionInfo.account_id,
        is_teacher: this.sessionInfo.is_teacher,
        filename: filename,
        id: dataId,
        which: parentEl.dataset.which,
      };
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      axios
        .post('../../server/api/getArrayFromCsv.php', params, this.headerObject)
        .then(response => {
          let read_filename = this.noteItems.path.replace(/(.*).\//g, '');
          if (read_filename.indexOf('progress') > -1) this.note_progress = true;
          let noteResp = response.data.contents;
          this.noteDetail = noteResp;
          this.noteDetail.mode = mode;
          this.noteDetail.filename = filename;
          this.noteDetail.created_at =
            noteResp.created_at != '' ? noteResp.created_at.replace(/ \d{2}:\d{2}:\d{2}/g, '') : '';
          let bodyArray = noteResp.note.split('\\n');
          let trim_first = bodyArray[0].replace('"', '');
          bodyArray[0] = trim_first;
          let last = bodyArray.length - 1;
          let trim_last = bodyArray[last].replace('"', '');
          bodyArray[last] = trim_last;
          let re_bodyArray = [];
          let spare_bodyArray = [];
          bodyArray.forEach(function (line, i) {
            let new_line;
            let spare_line;
            if (mode == 1) new_line = line.replaceAll('\\r', '').replaceAll(/link?_\((.*)\)/g, '');
            if (mode != 1) {
              new_line = line.replaceAll('\\r', '');
              spare_line = new_line;
              const link_style = "color:cornflowerblue;text-decoration-line:none;font-size:125%;";
              new_line = new_line
                .replaceAll(/link?_\(/g, "<a target='_blank' style='"+ link_style +"' href=")
                .replaceAll(/\"\)/g, '">【*】</a>');
            }
            re_bodyArray.push(new_line);
            spare_bodyArray.push(spare_line);
          });
          this.noteDetail.bodyArray = re_bodyArray;
          if(mode != 1) this.noteDetail.spare_bodyArray = spare_bodyArray;
          this.noteDetail.note = "";
          this.$emit('note-detail', this.noteDetail); //emitでは何故かキャメルケースが使えないので注意
          mode == 1 ? (this.openSection_dlnote = true) : (this.openSection_linknote = true);
        })
        .then(e => {
          // ノートの詳細エリアの各種切替ボタンで使われるフラグを初期化する
          this.allToggle = 1;
          this.viewTypeToggle = 0;

          if (mode == 2) {
            let linkedNoteArea = document.getElementById('linkedNoteArea');
            linkedNoteArea.innerHTML = '';
            this.noteDetail.bodyArray.forEach(function (line, i) {
              linkedNoteArea.innerHTML += "<p class='lines'>" + line + '</p>';
            });
          }
          let lines = document.querySelectorAll('.lines');
          this.linesSetStile(lines, mode);
        })
        .catch(error => alert('通信に失敗しました。'));
      if (window.innerWidth >= 480) {
        this.styles.widthFlex = 'display:flex;justify-content: space-between;';
      } else {
        this.styles.widthFlex = 'display:block;justify-content: space-between;';
      }
    },
    returnDefaultThis() {
      // 表示前に初期化
      this.openSection_dlnote = this.openSection_linknote = this.note_progress = false;
      this.noteDetail = {};
    },
    linesSetStile(lines, mode) {
      lines.forEach(line => {
        const startRegex = /^(☆|【)/;
        const endRegex = /(☆|】)$/;
        const startRoundRegex = /^●[^ _\/\\\$\%]{1,5}/;
        if (
          (startRegex.test(line.innerText) && endRegex.test(line.innerText)) ||
          startRoundRegex.test(line.innerText)
        ) {
          line.style.fontWeight = '700';
          (mode==2) ? line.style.marginTop = '2em' : line.parentElement.style.marginTop = '1em';
        }
        const startSearchRegex = /^[^ 　_\/\\\$\%]{1,}/;
        const endSearchRegex = /[^ 　_\/\\\$]$/;
        if (
          this.searched_word != '' &&
          startSearchRegex.test(this.searched_word) &&
          endSearchRegex.test(this.searched_word) &&
          line.innerText.indexOf(this.searched_word) > -1
        ) {
          line.style.color = '#0082ff';
          line.style.fontWeight = '600';
        } else {
          line.style.fontWeight = '500';
        }
      });
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
    startScope(num) {
      this.scopeMode.selecting = true;
      this.scopeMode.startNum = num;
    },
    endScope(num) {
      this.scopeMode.selecting = false;
      this.scopeMode.endNum = num;
      const startNum = this.scopeMode.startNum;
      const endNumNext = this.scopeMode.endNum + 1;
      for (let i = startNum; i < endNumNext; i++){
        this.scopeMode.selectedScopes.push(i);
      }
      this.scopeMode.minSelectableNum = this.scopeMode.endNum;
      this.scopeMode.startNum = this.scopeMode.endNum = 0;
    },
    activateScopeMode() {
      this.allOn();
      this.noAppearingNotes = true;
      this.noAppearingConfirmDialog = false;
    },
    preActivateScopeMode() {
      this.scopeMode.active = true;
      if (!this.noAppearingNotes) {
        this.noAppearingConfirmDialog = true;
      } else {
        this.activateScopeMode();
      }
    },
    cancelActivateScopeMode() {
      this.scopeMode.active = false;
      this.noAppearingConfirmDialog = false;
    },
    showNoAppearing() {
      if (!this.noAppearingNotes) {
        this.noAppearingConfirmDialog = true;
      } else {
        this.changeFornoAppearingNotes();
      }
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
          let weitOneSec = setTimeout(() => {
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
    dlFunction(data) {
      // 画面上に表示されている値をセット
      let fileName = this.noteDetail.title;
      let outputText = 'タイトル： ' + fileName + '\n\n';
      if (this.scopeMode.active) {
        data.forEach(line => (outputText += line + '\n'));
      } else {
        let lines = document.querySelectorAll(data);
        lines.forEach(e => (outputText += e.innerText + '\n'));
      }
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
    doScopeDownload(event) {
      try {
        const numArray = this.scopeMode.selectedScopes;
        if (numArray.length > 0) {
          let textArray = [];
          numArray.forEach((num, i) => {
            let rowText = document.getElementById('selected_' + num).getAttribute('data-selectedparts');
            if (i > 0) {
              if(num - numArray[i-1] > 1) rowText = `\n${rowText}`;
            }
            textArray.push(rowText);
          });
          this.dlFunction(textArray);
          event.target.parentElement.style.display = 'none';
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    viewBlankNoteArea(event) {
      this.openSection_dlnote = this.openSection_linknote = false;
      this.blankNoteArea = true;
      this.blankNoteText = '';
      let linesArray = [];
      document.querySelectorAll('.visible').forEach(item => linesArray.push(item.innerText));
      this.blankNoteText = linesArray.join('\n');
    },
    setSelection() {
      const textarea = document.querySelector('textarea');
      const selectionObject = useSetSelection(textarea);
      return selectionObject;
    },
    toSecretSimple() {
      const selection = this.setSelection();
      this.blankNoteText = this.getSecretPhrase(selection);
    },
    getSecretPhrase(selection) {
      return useGetSecretPhrase(selection);
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

export default csvNoteArea;