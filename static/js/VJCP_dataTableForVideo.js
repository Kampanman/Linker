/**
 * コンポーネント：動画用データテーブル
 */

 let dataTableForVideo = Vue.component('table-video', {
  template: `<div id="videoArea" style="padding:1em">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="6"><tag-title>ログインユーザー登録動画一覧</tag-title></v-col>
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
        <template v-slot:item.view="{ item }">
          <v-btn fab small :style="client.palette.redFront" @click="showFrame(item)">▶</v-btn>
        </template>
        <template v-slot:item.editAndDelete="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small v-if="item.id!=1" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card><br />
    <div v-if="formMode=='watch'" :class="formMode=='watch' ? 'fader' : 'none'">
      <tag-title>選択された動画</tag-title>
      <div><label><b>タイトル: </b></label><span v-text="viewVideo.title"></span></div><br />
      <div>
        <iframe :width="frameSize.width" :height="frameSize.height" 
          :src="viewVideo.url.replace('watch?v=','embed/')"
          title="YouTube video player"
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>
      </div>
    </div>
    <div 
      v-if="formMode=='init'" 
      :class="formMode=='init' ? 'fader' : 'none'"
      style="display:table;height:10rem;margin:auto;"
    >
      <p align="center" style="display:table-cell;vertical-align:middle;font-weight:600;">
        新規作成ボタン または 編集アイコンを押すと<br>フォームエリアが開きます
      </p>
    </div>
    <div v-if="formMode=='create' || formMode=='edit'">
      <br />
      <v-card style="padding:1em;background:rgb(239, 235, 222);border:1px solid rgb(235, 235, 235);">
        <section align="right">
          <v-btn class="mx-2" fab small :style="client.palette.brownBack" @click="formMode = 'init'">×</v-btn>
        </section>
        <section><br />
          <v-text-field label="動画タイトル" placeholder="タイトルを入力してください" v-model="selectItem.title"></v-text-field>
          <v-text-field label="URL" placeholder="URLを入力してください" v-model="selectItem.url"></v-text-field>
          <v-text-field label="動画タグ" placeholder="タグを入力してください" v-model="selectItem.tags"></v-text-field>
          <div style="margin:5px;width:180px;">
            <v-app>
              <v-select label="公開設定" :items="pubStrs" v-if="selectItem.id!=1" v-model="selectItem.pub_str"></v-select>
            </v-app>
          </div><br />
        </section>
        <p>
          <ul style="list-style:none;">
            <li :style="styles.ctred" v-if="v_flg.isEmpty.title==true" @click="v_flg.isEmpty.title=false" v-text="client.phrase.validation.titleEmpty"></li>
            <li :style="styles.ctred" v-if="v_flg.length.title==true" @click="v_flg.length.title=false" v-text="client.phrase.validation.overTitle"></li>
            <li :style="styles.ctred" v-if="v_flg.length.tags==true" @click="v_flg.length.tags=false" v-text="'設定タグの文字数が上限を超えています。'"></li>
            <li :style="styles.ctred" v-if="v_flg.isNotUrl==true" @click="v_flg.isNotUrl=false" v-text="client.phrase.validation.urlInvalid"></li>
            <li :style="styles.ctred" v-if="v_flg.isEmpty.url==true" @click="v_flg.isEmpty.url=false" v-text="client.phrase.validation.videoUrlEmpty"></li>
          </ul>
        </p>
        <section align="center">
        <v-btn :style="client.palette.brownFront" v-if="formMode=='create'" v-text="client.phrase.button.insert" @click="openInsertConfirm"></v-btn>
        <v-btn :style="client.palette.brownFront" v-if="formMode=='edit'" v-text="client.phrase.button.update" @click="openUpdateConfirm"></v-btn>
        </section>
      </v-card>
    </div>

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
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      client: this.cl,
      v_flg: this.cl.validationflg,
      pubStrs: ["公開","講師にのみ公開","非公開"],
      selectItem:{
        id: "",
        title: "",
        tags: "",
        url: "",
        publicity: "",
        pub_str: "公開",
      },
      viewVideo: {
        title: "",
        url: "",
      },
      frameSize: { width: 560, height: 315 },
      dialog: {
        replaceAll: false,
        replaceComplete: false,
        confirmInsert: false,
        completeInsert: false,
        confirmUpdate: false,
        completeUpdate: false,
        confirmDelete: false,
        completeDelete: false,
      },
      search: "",
      styles: {
        ctred: "text-align:center;color:red;font-weight:600;cursor:pointer",
      },
      formMode: "init", // init:初期状態, create:新規作成, edit:更新, watch:動画視聴
      headers: [
        { text: "視聴する", value: "view", align: "start" },
        { text: "タイトル", value: "title" },
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
      this.getAccountVideo(); 
    },
    getAccountVideo() {
      let data = { 
        which: "video",
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
    showFrame(item) {
      let data = {
        search_for: 'single',
        which: 'video',
        id: item.id
      }

      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/searchGetter.php', params, this.headerObject)
        .then(response => {
          this.viewVideo.title = item.title;
          this.viewVideo.url = response.data.result.video[0].url;
          
          const v_area = document.getElementById('videoArea');
          (window.innerWidth>=480)
            ? this.frameSize.width = v_area.clientWidth - 60
            : this.frameSize.width = v_area.clientWidth - 30;
          this.frameSize.height = this.frameSize.width * 9 / 16;
          this.formMode = "watch";
        }).catch(error => alert("通信に失敗しました。"));
    },
    deleteItem(item) {
      this.selectItem.id = item.id;
      this.selectItem.title = item.title;
      this.selectItem.publicity = item.publicity;
      this.dialog.confirmDelete = true;
    },
    insertItem() {
      this.selectItem = { id: "", title: "", tags: "", url: "", publicity: "", pub_str: "公開" };
      this.reset_vFlg();
      this.formMode = 'create';
    },
    editItem(item) {
      let data = {
        search_for: 'single',
        which: 'video',
        id: item.id
      }

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
          this.selectItem.tags = item.tags;
          this.selectItem.url = response.data.result.video[0].url;
          this.selectItem.publicity = item.publicity;
          if(this.selectItem.publicity=="1"){
            this.selectItem.pub_str = "公開";
          }else if(this.selectItem.publicity=="2"){
            this.selectItem.pub_str = "講師にのみ公開";
          }else{
            this.selectItem.pub_str = "非公開";
          }
          this.reset_vFlg();
          this.formMode = "edit";
        }).catch(error => alert("通信に失敗しました。"));
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
      if(this.selectItem.tags.length > 100){
        this.v_flg.length.tags = true;
        decision = true;
      };
      if(this.selectItem.url==""){
        this.v_flg.isEmpty.url = true;
        decision = true;
      };
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
    doInsert() {
      let data = {
        type: 'insert',
        which: 'video',
        title: this.selectItem.title,
        tags: this.selectItem.tags,
        url: this.selectItem.url,
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
        which: 'video',
        id: this.selectItem.id,
        title: this.selectItem.title,
        tags: this.selectItem.tags,
        url: this.selectItem.url,
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
      let publicity = 1;
      if(pub_str=="非公開") publicity = 0;
      if(pub_str=="講師にのみ公開") publicity = 2;
      return publicity;
    },
    doDelete() {
      let data = {
        type: 'delete',
        which: 'video',
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
    reset_vFlg() {
      this.v_flg.isEmpty.title = false;
      this.v_flg.length.title = false;
      this.v_flg.isEmpty.url = false;
      this.v_flg.isNotUrl = false;
    },
  },
 });

 export default dataTableForVideo;