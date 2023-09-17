/**
 * コンポーネント：登録CSV用ノート一覧・ノート本文エリア
 */
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
          <div :style="styles.widthFlex + styles.alignItem">
            <div style="margin-right:10px;margin-bottom:10px;"><br />
              <v-btn v-if="allToggle==1" :style="colorPalette.brownFront" @click="doDownload($event)">ノートをダウンロード</v-btn>
              <v-btn v-if="allToggle==0" :style="colorPalette.brownFront" @click="doPartDownload($event)">ノートをダウンロード（部分出力）</v-btn>
            </div>
            <div style="margin-bottom:10px;">
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
          <div align="right" style="margin: 10px 5px; align-items: center;">
            <label><b>ON時出力 </b></label>
            <v-btn v-if="viewTypeToggle==0" :style="colorPalette.greenBack" @click="viewTypeToggle=1">全文</v-btn>
            <v-btn v-if="viewTypeToggle==1" :style="colorPalette.greenFront" @click="viewTypeToggle=0">一文字ずつ</v-btn>
          </div><br />
          <div :style="styles.alignItem">
            <ul class="noteUl">
              <li style="list-style: none;" v-for="(parts, i) of noteDetail.bodyArray">
                <span v-if="parts.trim().length > 0 && rowButtonHidden==false"
                  :id="'on_'+(i+1)"
                  :data-id="(i+1)"
                  :style="colorPalette.blueFront + toggleBadgeStyle"
                  @click="forOn($event)"> ON </span>
                <span v-if="parts.trim().length > 0 && rowButtonHidden==false"
                  :id="'off_'+(i+1)"
                  :data-id="(i+1)"
                  :style="colorPalette.blueBack + toggleBadgeStyle"
                  @click="forOff($event)"> OFF </span>
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

  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      allToggle: 1,
      viewTypeToggle: 0,
      rowButtonHidden: false,
      articlableFlg: false,
      blankNoteArea: false,
      blankNoteText: '',
      frameSize: { width: 560, height: 315 },
      newTabConfirmDialog: false,
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
  created: function () {
    this.init();
  },
  props: ['stl', 'session', 'palette', 'items', 'searched'],
  methods: {
    // 画面初期表示処理
    async init() {
      //
    },
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
      this.openSection_dlnote = false;
      this.openSection_linknote = false;
      this.note_progress = false;
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
      this.allToggle = 0;
    },
    forOn(event) {
      let targetRow = document.getElementById('line_' + event.target.dataset.id);
      let rowTextArray = [];
      if (this.viewTypeToggle == 1) {
        rowTextArray = targetRow.innerText.split("");
        targetRow.innerText = "";
      }
      targetRow.style.opacity = 1;
      targetRow.classList.add('visible');
      let index = 0;
      if (this.viewTypeToggle == 1) {
        this.rowButtonHidden = true;
        let addFunction = setInterval(() => { 
          /**
           * setInterval使うと変数の参照先が変化するとかどうとかで、function(){ ~ }のままでは使えないらしい。
           * その為、function(){ ~ }ではなくてアロー関数を使う必要がある。
           */
          targetRow.innerText += rowTextArray[index];
          index++;
          if (index == rowTextArray.length) {
            clearInterval(addFunction);
            this.rowButtonHidden = false;
          }
        }, 80);
      }
      this.allToggle = 1;
    },
    allOff() {
      let lines = document.querySelectorAll('.lines');
      lines.forEach(e => {
        e.style.opacity = 0;
        e.classList.remove('visible');
      });
      this.allToggle = 0;
    },
    allOn() {
      let lines = document.querySelectorAll('.lines');
      lines.forEach(e => {
        e.style.opacity = 1;
        e.classList.add('visible');
      });
      this.allToggle = 1;
    },
    dlFunction(linesClass) {
      // 画面上に表示されている値をセット
      let fileName = this.noteDetail.title;
      let outputText = 'タイトル： ' + fileName + '\n\n';
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
    doDownload(event) {
      try {
        const linesClass = '.lines';
        this.dlFunction(linesClass);
        event.target.parentElement.style.display = 'none';
      } catch (e) {
        console.log(e.message);
      }
    },
    doPartDownload(event) {
      try {
        const linesClass = '.visible';
        this.dlFunction(linesClass);
        event.target.parentElement.style.display = 'none';
      } catch (e) {
        console.log(e.message);
      }
    },
    viewBlankNoteArea(event) {
      this.openSection_dlnote = false;
      this.openSection_linknote = false;
      this.blankNoteArea = true;
      this.blankNoteText = '';
      let linesArray = [];
      document.querySelectorAll('.visible').forEach(item => linesArray.push(item.innerText));
      this.blankNoteText = linesArray.join('\n');
    },
    setSelection() {
      let textarea = document.querySelector('textarea');
      let pos_start = textarea.selectionStart;
      let pos_end = textarea.selectionEnd;
      let val = textarea.value;
      let selectionObject = {
        textarea: textarea,
        range: val.slice(pos_start, pos_end),
        beforeNode: val.slice(0, pos_start),
        afterNode: val.slice(pos_end),
      };
      return selectionObject;
    },
    toSecretRandom() {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      const phraseArray = [
        '【＿見せられません＿】','【＿秘匿事項です＿】','【＿勘弁して下さい＿】','【＿ゴバァッ！＿】','【＿ぐぶっッ！＿】'
      ];
      let insertNode = phraseArray[Math.floor(Math.random() * phraseArray.length)];
      if (range.length > 0) textarea.value = beforeNode + insertNode + afterNode;
      this.blankNoteText = textarea.value;
    },
    toSecretSimple() {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let insertUnder = '';
      for (let i = 0; i < range.length; i++) insertUnder += '_';
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      if (range.length > 0) textarea.value = beforeNode + '【' + insertUnder + '】' + afterNode;
      this.blankNoteText = textarea.value;
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
      const pr = this.setNowDate();
      const untilDay = `${pr.year_str}${pr.month_strWithZero}${pr.day_strWithZero}`;
      const afterDay = `${pr.hour_strWithZero}${pr.minute_strWithZero}${pr.second_strWithZero}`;
      return `${untilDay}_${afterDay}`;
    },
    getJapDateString() {
      const pr = this.setNowDate();
      return `${pr.year_str}年${pr.month_str}月${pr.day_str}日 (${pr.dayOfWeekStr}) ${pr.hour_str}時${pr.minute_str}分`;
    },
    setNowDate() {
      const date = new Date();
      const setMonth = 1 + date.getMonth();
      const dayOfWeek = date.getDay(); // 曜日(数値)
      const dateParam = {
        year_str: date.getFullYear(),
        month_str: setMonth, //月だけ+1する
        month_strWithZero: setMonth.toString().padStart(2, '0'),
        day_str: date.getDate(),
        day_strWithZero: date.getDate().toString().padStart(2, '0'),
        hour_str: date.getHours(),
        hour_strWithZero: date.getHours().toString().padStart(2, '0'),
        minute_str: date.getMinutes(),
        minute_strWithZero: date.getMinutes().toString().padStart(2, '0'),
        second_strWithZero: date.getSeconds().toString().padStart(2, '0'),
        dayOfWeekStr: ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek], // 曜日
      };
      return dateParam;
    },
  },
});

export default csvNoteArea;