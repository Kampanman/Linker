/**
 * コンポーネント：リンク付動画編集エリア
 */

let csvEditNoteArea = Vue.component('csv-editvideo-area', {
  template: `<div>
    <card-sec-searched :prop="'videoInner'">
      <template #title><tag-title>編集中の動画</tag-title></template>
      <template #contents>
        <section>
          <div :style="styles.flexAlign + 'margin-top:1em;'">
            <p style="width:180px;margin-right:1em;">
              <v-text-field label="ID" placeholder="IDを入力してください" v-model="videoDetail.id" />
            </p>
            <v-btn :style="palette.brownFront + 'margin-right:1em'" @click="setMadeId">IDを作成する</v-btn>
            <p style="width:180px;margin-right:1em;">
              <v-text-field label="オリジナルID" placeholder="IDを作成できます" v-model="madeId" />
            </p>
          </div>
          <v-text-field label="動画タイトル" placeholder="タイトルを入力してください" v-model="videoDetail.title"></v-text-field>
          <v-text-field label="URL" placeholder="URLを入力してください" v-model="videoDetail.url"></v-text-field>
          <v-text-field label="タグ" placeholder="タグを入力してください" v-model="videoDetail.tags"></v-text-field>
          <div style="margin-bottom:1em;">
            <label style="margin-right:0.5em;"><b>公開状態（押すと切り替わります） </b></label>
            <v-btn v-if="videoDetail.publicity=='0'" :style="palette.redFront" @click="changePubStatus">非公開</v-btn>
            <v-btn v-if="videoDetail.publicity=='1'" :style="palette.greenFront" @click="changePubStatus">一般公開</v-btn>
            <v-btn v-if="videoDetail.publicity=='2'" :style="palette.orangeFront" @click="changePubStatus">講師にのみ公開</v-btn>
          </div><br />
          <div align="center">
            <v-btn v-if="doneDl==false" :style="palette.brownBack" @click="doDownload">レコードをダウンロード</v-btn>
          </div>
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
      videoDetail: this.items,
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
      // 
    },
    changePubStatus() {
      if (this.videoDetail.publicity == '0') {
        this.videoDetail.publicity = '1';
      } else if (this.videoDetail.publicity == '1') {
        this.videoDetail.publicity = '2';
      } else {
        this.videoDetail.publicity = '0';
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
    dlFunction() {
      // 画面上に表示されている値をセット
      let fileName = this.videoDetail.title;
      let outputText = '';
      outputText += '"' + this.videoDetail.id + '",';
      outputText += '"' + this.videoDetail.title + '",';
      outputText += '"' + this.videoDetail.url + '",';
      outputText += '"' + this.videoDetail.tags + '",';
      outputText += '"' + this.videoDetail.publicity + '",';
      outputText += '"' + this.videoDetail.created_at + ' 00:00:00' + '",';
      outputText += '"' + this.videoDetail.created_user_id + '"';
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