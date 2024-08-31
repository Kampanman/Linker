/**
 * コンポーネント：リンク付ノート編集エリア
 */

let csvEditNoteArea = Vue.component('csv-editnote-area', {
  template: `<div>
    <card-sec-searched :prop="'noteInner'">
      <template #title><tag-title>編集中のノート</tag-title></template>
      <template #contents>
        <section v-if="session.account_id=='1' || session.account_id==items.created_user_id">
          <div :style="styles.flexAlign + 'margin-top:1em;'">
            <p style="width:180px;margin-right:1em;">
              <v-text-field label="ID" placeholder="IDを入力してください" v-model="noteDetail.id" />
            </p>
            <v-btn :style="palette.brownFront + 'margin-right:1em'" @click="setMadeId">IDを作成する</v-btn>
            <p style="width:180px;margin-right:1em;">
              <v-text-field label="オリジナルID" placeholder="IDを作成できます" v-model="madeId" />
            </p>
          </div>
          <v-text-field label="ノートタイトル" placeholder="タイトルを入力してください" v-model="noteDetail.title"></v-text-field>
          <v-text-field label="URL" placeholder="URLを入力してください" v-model="noteDetail.url"></v-text-field>
          <div style="margin-bottom:1em;">
            <label style="margin-right:0.5em;"><b>公開状態（押すと切り替わります） </b></label>
            <v-btn v-if="noteDetail.publicity=='0'" :style="palette.redFront" @click="changePubStatus">非公開</v-btn>
            <v-btn v-if="noteDetail.publicity=='1'" :style="palette.greenFront" @click="changePubStatus">一般公開</v-btn>
            <v-btn v-if="noteDetail.publicity=='2'" :style="palette.orangeFront" @click="changePubStatus">講師にのみ公開</v-btn>
          </div><br />
          <div class="noteEditContainer">
            <div v-if="noteDetail.mode==2" :style="styles.flexAlign">
              <v-btn :style="palette.brownFront + 'margin-right:1em'" @click="addLinkForTextarea">リンクを挿入する</v-btn>
              <v-text-field label="挿入リンク" placeholder="挿入したいリンクのURLを入力してください" v-model="addLinkUrl"></v-text-field>
            </div>
            <div class="changeFlex" :style="styles.flexAlign">
              <v-text-field label="一括置換対象文字" v-model="replaceBefore" style="max-width:200px;margin-right:1em;"></v-text-field>
              <v-text-field label="一括置換後文字" v-model="replaceAfter" style="max-width:200px;margin-right:1em;"></v-text-field>
              <v-btn :style="palette.brownFront" v-text="'対象文字を一括置換する'" 
                @click="replaceBefore!='' ? dialog.replaceAll = true : dialog.replaceAll = false"
              ></v-btn>
            </div>
            <div>
              <label style="margin-right:1em;"><b>選択した部分</b></label>
              <v-btn :style="'margin:5px;' + palette.brownFront" v-text="'【】で囲む'" @click="surroundKakko"></v-btn>
              <v-btn :style="'margin:5px;' + palette.brownFront" v-text="'前後に☆をつける'" @click="surroundStar"></v-btn>
              <v-btn :style="'margin:5px;' + palette.brownFront" v-text="'半角化する'" @click="toHalfWidth"></v-btn>
              <v-btn :style="'margin:5px;' + palette.brownFront" v-text="'秘匿する'" @click="toSecret"></v-btn>
            </div><br />
            <v-app>
              <v-textarea outlined label="ノート本文" v-model="noteDetail.note" @input="" 
                placeholder="本文を入力してください（最大字数：空白・改行含め半角44,000文字）"
              ></v-textarea>
            </v-app>
          </div>
          <div align="center">
            <v-btn v-if="doneDl==false" :style="palette.brownBack" @click="doDownload">レコードをダウンロード</v-btn>
          </div>
        </section>
        <section align="center" v-else>
          <span>編集権限がないため、フォームを表示できません。</span>
        </section>

        <section>
          <!-- 対象文字一括置換確認モーダルダイアログ -->
          <dialog-frame-normal :target="dialog.replaceAll" :title="'一括置換確認'" 
            :contents="(replaceAfter!='') 
              ? replaceBefore +' を '+ replaceAfter +' に置換してもよろしいですか？'
              : replaceBefore +' を全消去してもよろしいですか？'"
          >
            <v-btn @click="allReplace" :style="palette.brownFront">実行</v-btn>
            <v-btn @click="dialog.replaceAll = false" :style="palette.brownBack">キャンセル</v-btn>
          </dialog-frame-normal>

          <!-- 対象文字一括置換完了モーダルダイアログ -->
          <dialog-frame-normal :target="dialog.replaceComplete" :title="'一括置換完了'" :contents="'一括置換が完了しました'">
            <v-btn @click="dialog.replaceComplete = false" :style="palette.brownFront" v-text="'閉じる'"></v-btn>
          </dialog-frame-normal>
        </section>

      </template>
    </card-sec-searched>
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      sessionInfo: this.session,
      noteDetail: this.items,
      colorPalette: this.palette,
      widthAlign: 'center',
      madeId: '',
      addLinkUrl: '',
      doneDl: false,
      replaceBefore: '',
      replaceAfter: '',
      dialog: {
        replaceAll: false,
        replaceComplete: false,
      },
      styles: this.stl,
    };
  },
  created: function () {
    this.init();
  },
  props: ['stl', 'session', 'palette', 'items'],
  methods: {
    // 画面初期表示処理
    async init() {
      this.setBodyArrayForNote();
    },
    changePubStatus() {
      if (this.noteDetail.publicity == '0') {
        this.noteDetail.publicity = '1';
      } else if (this.noteDetail.publicity == '1') {
        this.noteDetail.publicity = '2';
      } else {
        this.noteDetail.publicity = '0';
      }
    },
    setBodyArrayForNote() {
      if (this.noteDetail["spare_bodyArray"] != undefined) {
        this.noteDetail.note = this.noteDetail.spare_bodyArray.join('\n');
      } else {
        this.noteDetail.note = this.noteDetail.bodyArray.join('\n');
      }
    },
    setMadeId() {
      this.madeId = this.generatedChars() + this.generatedQuatNums();
    },
    generatedChars() {
      let chars = '';
      const base = ['a','i','u','e','o','b','c','d','f','g','h','k','l','m','n','p','r','s','t','y','z'];
      const bo_in = ['a','i','u','e','o'];
      for (let i = 0; i < 3; i++) {
        let base_rand = Math.floor(Math.random() * base.length);
        let boIn_rand = Math.floor(Math.random() * 5);
        chars += base[base_rand];
        chars += bo_in[boIn_rand];
      }
      return chars;
    },
    generatedQuatNums() {
      let nums = '';
      for (let i = 0; i < 4; i++) {
        let rand_num = String(Math.floor(Math.random() * 10));
        nums += rand_num;
      }
      return nums;
    },
    surroundKakko() {
      this.surrounder('【', '】');
    },
    surroundStar() {
      this.surrounder('☆', '☆');
    },
    surrounder(startStr, endStr) {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      let insertNode = startStr + range + endStr;
      if (range.length > 0) textarea.value = beforeNode + insertNode + afterNode;
      this.noteDetail.note = textarea.value;
    },
    toHalfWidth() {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      range = range.replace(/[！-～]/g, function (range) {
        return String.fromCharCode(range.charCodeAt(0) - 0xfee0);
      });
      if (range.length > 0) textarea.value = beforeNode + range + afterNode;
      this.noteDetail.note = textarea.value;
    },
    toSecret() {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      const phraseArray = [
        '【＿見せられません＿】', '【＿秘匿事項です＿】', '【＿勘弁して下さい＿】', '【＿ぐぶっッ！＿】', '【＿ゴバァッ！＿】'
      ];
      let insertNode = phraseArray[Math.floor(Math.random() * phraseArray.length)];
      if (range.length > 0) textarea.value = beforeNode + insertNode + afterNode;
      this.noteDetail.note = textarea.value;
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
    addLinkForTextarea() {
      let textarea = this.setSelection().textarea;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      const pattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;
      let insertNode = pattern.test(this.addLinkUrl) ? 'lin_("' + this.addLinkUrl + '")' : '';
      textarea.value = beforeNode + insertNode + afterNode;
      this.noteDetail.note = textarea.value;
    },
    allReplace() {
      let val = document.querySelector('textarea').value;
      this.noteDetail.note = val.replaceAll(this.replaceBefore, this.replaceAfter);
      this.dialog.replaceAll = false;
      this.dialog.replaceComplete = true;
    },
    dlFunction() {
      // 画面上に表示されている値をセット
      let fileName = this.noteDetail.title;
      let outputText = '';
      outputText += '"' + this.noteDetail.id + '",';
      outputText += '"' + this.noteDetail.title + '",';
      let addUrl = this.noteDetail.url != '' ? '"' + this.noteDetail.url + '",' : ',';
      outputText += addUrl;
      outputText += '"' + this.noteDetail.note.replaceAll('\n', '\\n') + '",';
      outputText += '"' + this.noteDetail.publicity + '",';
      outputText += '"' + this.noteDetail.created_at + ' 00:00:00' + '",';
      outputText += '"' + this.noteDetail.created_user_id + '"';

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
    doDownload() {
      try {
        this.dlFunction();
        this.doneDl = true;
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

export default csvEditNoteArea;