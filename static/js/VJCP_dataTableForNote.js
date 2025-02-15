/**
 * コンポーネント：ノート用データテーブル
 */
import {
  useConvertPublicity,
  useGetRandSecretPhrase,
  useSetSelection
} from './commonMethods/globalFunctions.js';

 let dataTableForNote = Vue.component('table-note', {
  template: `<div style="padding:1em">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="6"><tag-title>ログインユーザー登録ノート一覧</tag-title></v-col>
          <v-col cols="6" style="text-align:right">
            <v-btn color="primary" dark class="mb-2" v-text="'新規作成'" @click="insertItem"></v-btn>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="検索ワードを入力してください"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.editAndDelete="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small v-if="item.id!=1" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
    
    <div 
      v-if="formMode=='init'" 
      :class="formMode=='init' ? 'fader' : 'none'"
      style="display:table;height:10rem;margin:auto;"
    >
      <p align="center" style="display:table-cell;vertical-align:middle;font-weight:600;">
        新規作成ボタン または 編集アイコンを押すと<br>フォームエリアが開きます
      </p>
    </div>
    <div v-else>
      <br />
      <v-card style="padding:1em;background:rgb(239, 235, 222);border:1px solid rgb(235, 235, 235);">
        <section align="right">
          <v-btn class="mx-2" fab small :style="client.palette.brownBack" @click="formMode = 'init'">×</v-btn>
        </section>
        <section><br />
          <v-text-field label="ノートタイトル" placeholder="タイトルを入力してください" v-model="selectItem.title"></v-text-field>
          <v-text-field label="URL" placeholder="URLを入力してください" v-model="selectItem.url"></v-text-field>
          <div style="margin:5px;width:180px;">
            <v-app>
              <v-select label="公開設定" :items="pubStrs" v-if="selectItem.id!=1" v-model="selectItem.pub_str"></v-select>
            </v-app>
          </div>
          <div>
            <label style="margin-right:1em;"><b>選択した部分</b></label>
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'【】で囲む'" @click="surroundKakko"></v-btn>
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'前後に☆をつける'" @click="surroundStar"></v-btn>
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'半角化する'" @click="toHalfWidth"></v-btn>
            <v-btn :style="'margin:5px;' + client.palette.brownFront" v-text="'秘匿する'" @click="toSecret"></v-btn>
          </div>
          <div v-if="selectItem.insert_word_1st!=''">
            <label style="margin-right:1em;"><b>次の文字を挿入</b></label>
            <v-btn v-if="selectItem.insert_word_1st != ''"
              :style="'margin:5px;' + client.palette.brownFront" 
              :data-value="selectItem.insert_word_1st" 
              v-text="selectItem.insert_word_1st" 
              @click="insertWord($event)"
            ></v-btn>
            <v-btn v-if="selectItem.insert_word_2nd != ''"
              :style="'margin:5px;' + client.palette.brownFront" 
              :data-value="selectItem.insert_word_2nd" 
              v-text="selectItem.insert_word_2nd" 
              @click="insertWord($event)"
            ></v-btn>
            <v-btn v-if="selectItem.insert_word_3rd != ''"
              :style="'margin:5px;' + client.palette.brownFront" 
              :data-value="selectItem.insert_word_3rd" 
              v-text="selectItem.insert_word_3rd" 
              @click="insertWord($event)"
            ></v-btn>
          </div><br />
          <div>
            <v-app>
              <v-textarea outlined label="ノート本文" v-model="selectItem.note" @input="biteCount" 
                placeholder="本文を入力してください（最大字数：空白・改行含め半角44,000文字）"
              ></v-textarea>
            </v-app>
            <p align="center" v-if="currentBite!=0" v-text="'現在の本文総バイト数 ： '+ currentBite +' バイト'"></p>
          </div>
          <div class="changeFlex" :style="styles.replaceArea">
            <v-text-field label="一括置換対象文字" v-model="replaceBefore" style="max-width:200px;margin-right:1em;"></v-text-field>
            <v-text-field label="一括置換後文字" v-model="replaceAfter" style="max-width:200px;margin-right:1em;"></v-text-field>
            <v-btn :style="client.palette.brownFront" v-text="'対象文字を一括置換する'" 
              @click="replaceBefore!='' ? dialog.replaceAll = true : dialog.replaceAll = false"
            ></v-btn>
          </div><br />
        </section>
          <p>
          <ul style="list-style:none;">
            <li :style="styles.ctred" v-if="v_flg.isEmpty.title==true" @click="v_flg.isEmpty.title=false" v-text="client.phrase.validation.titleEmpty"></li>
            <li :style="styles.ctred" v-if="v_flg.isEmpty.note==true" @click="v_flg.isEmpty.note=false" v-text="client.phrase.validation.noteEmpty"></li>
            <li :style="styles.ctred" v-if="v_flg.length.title==true" @click="v_flg.length.title=false" v-text="client.phrase.validation.overTitle"></li>
            <li :style="styles.ctred" v-if="v_flg.isNotUrl==true" @click="v_flg.isNotUrl=false" v-text="client.phrase.validation.urlInvalid"></li>
            <li :style="styles.ctred" v-if="noteOverBite==true" @click="noteOverBite=false">本文の総バイト数が65,000を超えています</li>
          </ul>
        </p>
        <section align="center">
          <v-btn :style="client.palette.brownFront" v-if="formMode=='create'" v-text="client.phrase.button.insert" @click="openInsertConfirm"></v-btn>
          <v-btn :style="client.palette.brownFront" v-if="formMode=='edit'" v-text="client.phrase.button.update" @click="openUpdateConfirm"></v-btn>
        </section>
        <section align="center" style="margin-top:0.5em;">
          <v-btn :style="client.palette.brownBack" v-if="doneDownload==false" @click="doDownload($event)">ノートをダウンロード</v-btn>
          <v-btn :style="client.palette.brownBack" v-if="doneDownload==true" @click="dialog.confirmReload=true">リロード</v-btn>
        </section>
      </v-card>
    </div>

    <!-- 対象文字一括置換確認モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.replaceAll" :title="'一括置換確認'" 
      :contents="(replaceAfter!='') 
        ? replaceBefore +' を '+ replaceAfter +' に置換してもよろしいですか？'
        : replaceBefore +' を全消去してもよろしいですか？'"
    >
      <v-btn @click="allReplace" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="dialog.replaceAll = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 対象文字一括置換完了モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.replaceComplete" :title="'一括置換完了'" :contents="'一括置換が完了しました'">
      <v-btn @click="dialog.replaceComplete = false" :style="client.palette.brownFront" v-text="'閉じる'"></v-btn>
    </dialog-frame-normal>

    <!-- 登録確認モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.confirmInsert" :title="'登録確認'" :contents="client.phrase.message.confirm.insert">
      <v-btn @click="doInsert" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="dialog.confirmInsert = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 登録完了モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.completeInsert" :title="'登録完了'" :contents="client.phrase.message.complete.insert">
      <v-btn @click="doReload" :style="client.palette.brownFront" v-text="'リロード'"></v-btn>
    </dialog-frame-normal>

    <!-- 更新確認モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.confirmUpdate" :title="'更新確認'" :contents="client.phrase.message.confirm.update">
      <v-btn @click="doUpdate" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="dialog.confirmUpdate = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 更新完了モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.completeUpdate" :title="'更新完了'" :contents="client.phrase.message.complete.update">
      <v-btn @click="doReload" :style="client.palette.brownFront" v-text="'リロード'"></v-btn>
    </dialog-frame-normal>

    <!-- 削除確認モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.confirmDelete" :title="'削除確認'" :contents="client.phrase.message.confirmDelete">
      <v-btn @click="doDelete" :style="client.palette.brownFront" v-text="client.phrase.button.deleteDo"></v-btn>
      <v-btn @click="dialog.confirmDelete = false" :style="client.palette.brownBack" v-text="client.phrase.button.deleteCancel"></v-btn>
    </dialog-frame-normal>

    <!-- 削除完了モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.completeDelete" :title="'削除完了'" :contents="client.phrase.message.complete.delete">
      <v-btn @click="doReload" :style="client.palette.brownFront" v-text="'リロード'"></v-btn>
    </dialog-frame-normal>

    <!-- リロード確認ダイアログ -->
    <dialog-frame-normal :target="dialog.confirmReload" :title="'リロード確認'" :contents="'画面の再読み込みをします。よろしいですか？'">
      <v-btn @click="doReload" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="dialog.confirmReload = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      client: this.cl,
      v_flg: this.cl.validationflg,
      currentBite: 0,
      noteOverBite: false,
      doneDownload: false,
      pubStrs: ["公開","講師にのみ公開","非公開"],
      selectItem:{
        id: "",
        title: "",
        url: "",
        insert_word_1st: "",
        insert_word_2nd: "",
        insert_word_3rd: "",
        note: "",
        publicity: "",
        pub_str: "公開",
      },
      dialog: {
        replaceAll: false,
        replaceComplete: false,
        confirmReload: false,
        confirmInsert: false,
        completeInsert: false,
        confirmUpdate: false,
        completeUpdate: false,
        confirmDelete: false,
        completeDelete: false,
      },
      styles: {
        replaceArea: "display:flex;align-items:baseline;",
        ctred: "text-align:center;color:red;font-weight:600;cursor:pointer;",
      },
      search: "",
      formMode: "init", // init:初期状態, create:新規作成, edit:更新
      replaceBefore: "",
      replaceAfter: "",
      headers: [
        { text: "タイトル", value: "title", align: "start" },
        { text: "登録日時", value: "created_at" },
        { text: "公開状態", value: "pub_str", sortable: false, filterable: false },
        { text: "編集/削除", value: "editAndDelete", sortable: false, filterable: false }
      ],
      items: [],
    };
  },
  created: function () {
    this.init();
  },
  props: ['id','cl'],
  methods: {

    // 画面初期表示処理
    async init() {
      this.getAccountNote();
    },
    getAccountNote() {
      let data = { 
        which: "note",
        user_id: this.id,
      };
      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/usersItemGetter.php', params, this.headerObject)
        .then(response => {
          this.items = response.data;
        }).catch(error => alert("通信に失敗しました。"));
    },
    deleteItem(item) {
      this.selectItem.id = item.id;
      this.selectItem.title = item.title;
      this.selectItem.publicity = item.publicity;
      this.dialog.confirmDelete = true;
      this.currentBite = 0;
    },
    insertItem() {
      this.selectItem = { 
        id: "", 
        title: "", 
        url: "",
        insert_word_1st: "",
        insert_word_2nd: "",
        insert_word_3rd: "",
        note: "", 
        publicity: "", 
        pub_str: "公開"
      };
      this.currentBite = 0;
      this.replaceBefore = "";
      this.replaceAfter = "";
      this.judgeStyle();
      this.reset_vFlg();
      this.formMode = 'create';
    },
    editItem(item) {
      let data = {
        search_for: 'single',
        which: 'note',
        id: item.id
      }
      this.currentBite = 0;
      this.doneDownload = false;

      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/searchGetter.php', params, this.headerObject)
        .then(response => {
          this.selectItem.id = item.id;
          this.selectItem.title = item.title;
          this.selectItem.url = response.data.result.note[0].url;
          this.selectItem.note = response.data.result.note[0].note;
          this.selectItem.insert_word_1st = response.data.result.note[0].insert_word_1st,
          this.selectItem.insert_word_2nd = response.data.result.note[0].insert_word_2nd,
          this.selectItem.insert_word_3rd = response.data.result.note[0].insert_word_3rd,
          this.selectItem.publicity = item.publicity;
          if(this.selectItem.publicity=="1"){
            this.selectItem.pub_str = "公開";
          }else if(this.selectItem.publicity=="2"){
            this.selectItem.pub_str = "講師にのみ公開";
          }else{
            this.selectItem.pub_str = "非公開";
          }
          this.judgeStyle();
          this.reset_vFlg();
          this.replaceBefore = "";
          this.replaceAfter = "";
          this.formMode = "edit";
        }).catch(error => alert("通信に失敗しました。"));
    },
    judgeStyle() {
      (window.innerWidth < 480) ? 
        this.styles.replaceArea = "display:block;" : this.styles.replaceArea = "display:flex;align-items:baseline;"
    },
    surroundKakko() {
      this.surrounder("【","】");
    },
    surroundStar() {
      this.surrounder("☆","☆");
    },
    setSelection() {
      const textarea = document.querySelector('textarea');
      const selectionObject = useSetSelection(textarea);
      return selectionObject;
    },
    toHalfWidth() {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      range = range.replace(/[！-～]/g, function(range){
        return String.fromCharCode(range.charCodeAt(0)-0xFEE0);
      });
      if(range.length > 0) textarea.value = beforeNode + range + afterNode;
      this.selectItem.note = textarea.value;
    },
    getRandSecretPhrase(selection) {
      return useGetRandSecretPhrase(selection);
    },
    toSecret() {
      const selection = this.setSelection();
      this.selectItem.note = this.getRandSecretPhrase(selection);
    },
    surrounder(startStr, endStr) {
      let textarea = this.setSelection().textarea;
      let range = this.setSelection().range;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      let insertNode = startStr + range + endStr;
      if(range.length > 0) textarea.value = beforeNode + insertNode + afterNode;
      this.selectItem.note = textarea.value;
    },
    insertWord(event) {
      let insertWord = event.target.dataset.value;
      let textarea = this.setSelection().textarea;
      let beforeNode = this.setSelection().beforeNode;
      let afterNode = this.setSelection().afterNode;
      textarea.value = beforeNode + insertWord + afterNode;
      this.selectItem.note = textarea.value;
    },
    allReplace() {
      let val = document.querySelector('textarea').value;
      this.selectItem.note = val.replaceAll(this.replaceBefore, this.replaceAfter);
      this.dialog.replaceAll = false;
      this.dialog.replaceComplete = true;
    },
    openInsertConfirm() {
      if(this.validation()){
        return;
      }else{
        this.dialog.confirmInsert = true;
      }
    },
    openUpdateConfirm() {
      if(this.validation()){
        return;
      }else{
        this.dialog.confirmUpdate = true;
      }
    },
    validation() {
      let decision = false;

      if(this.selectItem.title==""){
        this.v_flg.isEmpty.title = true;
        decision = true;
      };
      if(this.selectItem.title.length > 100){
        this.v_flg.length.title = true;
        decision = true;
      };
      if(this.selectItem.note==""){
        this.v_flg.isEmpty.note = true;
        decision = true;
      };
      if(this.biteCount(this.selectItem.note) > 65000){
        this.noteOverBite = true;
        decision = true;
      }
      if(this.selectItem.url!=""){
        const pattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;
        let result = pattern.test(this.selectItem.url);
        if(!result){
          this.v_flg.isNotUrl = true;
          decision = true;
        }
      };
      return decision;
    },
    biteCount () {
      let number_bytes = encodeURI(this.selectItem.note).replace(/%../g, "*").length;
      this.currentBite = number_bytes;
      return number_bytes;
    },
    doInsert() {
      let data = {
        type: 'insert',
        which: 'note',
        title: this.selectItem.title,
        url: this.selectItem.url,
        note: this.selectItem.note,
        publicity: this.convertPublicity(this.selectItem.pub_str),
        user_id: this.id,
      }
      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/noteVideoCRUD.php', params, this.headerObject)
        .then(response => {
          this.dialog.confirmInsert = false;
          this.dialog.completeInsert = true;
        }).catch(error => alert("通信に失敗しました。"));
    },
    doUpdate() {
      let data = {
        type: 'update',
        which: 'note',
        id: this.selectItem.id,
        title: this.selectItem.title,
        url: this.selectItem.url,
        note: this.selectItem.note,
        publicity: this.convertPublicity(this.selectItem.pub_str),
        user_id: this.id,
      }
      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/noteVideoCRUD.php', params, this.headerObject)
        .then(response => {
          this.dialog.confirmUpdate = false;
          this.dialog.completeUpdate = true;
        }).catch(error => alert("通信に失敗しました。"));
    },
    convertPublicity(pub_str) {
      return useConvertPublicity(pub_str);
    },
    doDelete() {
      let data = {
        type: 'delete',
        which: 'note',
        id: this.selectItem.id,
      }
      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/noteVideoCRUD.php', params, this.headerObject)
        .then(response => {
          this.dialog.confirmDelete = false;
          this.dialog.completeDelete = true;
        }).catch(error => alert("通信に失敗しました。"));
    },
    doReload() {
      setTimeout(function(){
        location.reload();
      }, 1000);
    },
    doDownload(event) {
      try {
        // ノートのタイトルと本文の値をセット
        let fileName = this.selectItem.title;
        let outputText = 'タイトル： ' + fileName + '\n\n';
        outputText += '＝ ノート本文 ＝' + '\n\n';
        outputText += this.selectItem.note + '\n';

        // 出力日時を設定
        let now = new Date();
        outputText += '\n出力日時： ' + this.getStringFromDate(now);

        // テキストファイルのダウンロード
        const blob = new Blob([outputText], { type: 'text/plain' });
        const aTag = document.createElement('a');
        aTag.href = URL.createObjectURL(blob);
        aTag.target = '_blank';
        aTag.download = fileName + ' （編集版）';
        aTag.click();
        URL.revokeObjectURL(aTag.href);
      } catch (e) {
        console.log(e.message);
      }
      this.doneDownload = true;
    },
    reset_vFlg() {
      this.v_flg.isEmpty.title = false;
      this.v_flg.length.title = false;
      this.v_flg.isEmpty.note = false;
      this.v_flg.isNotUrl = false;
    },
    getStringFromDate(date) {
      let year_str = date.getFullYear();
      let month_str = 1 + date.getMonth(); //月だけ+1する
      let day_str = date.getDate();
      let hour_str = date.getHours();
      let minute_str = date.getMinutes();
      let dayOfWeek = date.getDay() ;	// 曜日(数値)
      let dayOfWeekStr = ["日","月","火","水","木","金","土"][dayOfWeek] ;	// 曜日

      return `${year_str}年${month_str}月${day_str}日 (${dayOfWeekStr}) ${hour_str}時${minute_str}分`;
    },
  },
 });

 export default dataTableForNote;