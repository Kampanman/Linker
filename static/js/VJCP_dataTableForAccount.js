/**
 * コンポーネント：アカウント用データテーブル
 */

let dataTableForAccount = Vue.component('table-account', {
  template: `<div>
    <div style="padding:1em">
      <account-self :id="id" :cl="client"></account-self>
    </div>
    <div v-if="is_teacher==1" style="padding:1em">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="6"><tag-title>ユーザーアカウント一覧</tag-title></v-col>
            <v-col cols="6" style="text-align:right">
              <v-btn color="primary" dark class="mb-2" v-text="'新規追加'" @click="insertItem"></v-btn>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="検索ワードを入力してください" single-line hide-details></v-text-field>
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
          <template v-slot:item.is_stopped="{ item }">
            <span v-if="item.is_stopped==1">停止中</span>
            <span v-else></span>
          </template>
          <template v-slot:item.editAndStop="{ item }">
            <v-icon small title="このアカウントの情報を編集します" v-if="item.id!=1 && item.id!=id" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small title="このアカウントを停止します" v-if="item.id!=1 && item.id!=id && item.is_stopped==0" @click="stopItem(item)">mdi-close-octagon-outline</v-icon>
            <v-icon small title="このアカウントを再開します" v-if="item.id!=1 && item.id!=id && item.is_stopped==1" @click="stopItem(item)">mdi-play-circle-outline</v-icon>
          </template>
        </v-data-table>
      </v-card>
      <div v-if="formMode=='init'" :class="formMode=='init' ? 'fader' : 'none'"style="display:table;height:10rem;margin:auto;">
        <p align="center" style="display:table-cell;vertical-align:middle;font-weight:600;">
          新規追加ボタン または 編集アイコンを押すと<br>フォームエリアが開きます
        </p>
      </div>
      <div v-else>
        <br />
        <v-card style="padding:1em;background:rgb(239, 235, 222);border:1px solid rgb(235, 235, 235);">
          <section align="right">
            <v-btn class="mx-2" fab small :style="client.palette.brownBack" @click="formMode = 'init'">×</v-btn>
          </section>
          <section style="display:flex" v-if="formMode!='create'">
            <div style="padding-right:1em;">
              <label style="margin-right:0.3em;"><b>アカウント名の編集</b></label>
              <v-btn :style="client.palette.brownFront" v-if="onEditAccountName == false" @click="onEditAccountName = true">有効にする</v-btn>
              <v-btn :style="client.palette.brownBack" v-if="onEditAccountName == true" @click="onEditAccountName = false">無効にする</v-btn>
            </div>
            <div>
              <label style="margin-right:0.3em;"><b>ログインIDの編集</b></label>
              <v-btn :style="client.palette.brownFront" v-if="onEditAccountId == false" @click="onEditAccountId = true">有効にする</v-btn>
              <v-btn :style="client.palette.brownBack" v-if="onEditAccountId == true" @click="onEditAccountId = false">無効にする</v-btn>
            </div>
          </section>
          <section><br />
            <v-text-field label="アカウント名" v-model="selectItem.name" placeholder="アカウント名を入力してください" :disabled="onEditAccountName == false"></v-text-field>
            <v-text-field label="ログインID" v-model="selectItem.login_id" placeholder="ログインID（メールアドレス）を入力してください" :disabled="onEditAccountId == false"></v-text-field>
            <v-text-field label="パスワード" v-model="selectItem.password" placeholder="パスワード（半角英数字混在 6字以上16字以内）を入力してください" v-if="formMode=='create'"></v-text-field>
            <div style="margin:5px;width:180px;">
              <v-app>
                <v-select label="権限" :items="is_teacherStrs" v-model="selectItem.isTeacher_str"></v-select>
              </v-app>
            </div><br />
          </section>
            <p>
            <ul style="list-style:none;">
              <li :style="styles.ctred" v-if="v_flg.isEmpty.account.name==true" @click="v_flg.isEmpty.account.name=false" v-text="validMessage.accountEmpty"></li>
              <li :style="styles.ctred" v-if="v_flg.isEmpty.account.loginID==true" @click="v_flg.isEmpty.account.loginID=false" v-text="validMessage.loginIDEmpty"></li>
              <li :style="styles.ctred" v-if="isNotMailAddress==true" @click="isNotMailAddress=false" v-text="'ログインIDがメールアドレス形式ではありません'"></li>
              <li :style="styles.ctred" v-if="v_flg.isEmpty.account.password==true" @click="v_flg.isEmpty.account.password=false" v-text="validMessage.passwordEmpty"></li>
              <li 
                :style="styles.ctred" 
                v-if="v_flg.isEmpty.account.name==false && v_flg.length.account.name==true" 
                @click="v_flg.length.account.name=false" 
                v-text="validMessage.overAccount"
              ></li>
              <li 
                :style="styles.ctred" 
                v-if="v_flg.isEmpty.account.password==false && v_flg.isNotPassword==true" 
                @click="v_flg.isNotPassword=false" 
                v-text="validMessage.passwordInvalid"
              ></li>
              <li 
                :style="styles.ctred" 
                v-if="v_flg.isEmpty.account.name==false && v_flg.isExist.name==true" 
                @click="v_flg.isExist.name=false" 
                v-text="validMessage.accountAlready"
              ></li>
              <li 
                :style="styles.ctred" 
                v-if="v_flg.isEmpty.account.loginID==false && v_flg.isExist.loginID==true" 
                @click="v_flg.isExist.loginID=false" 
                v-text="validMessage.loginIDAlready"
              ></li>
            </ul>
          </p>
          <section align="center">
            <v-btn :style="client.palette.brownFront" v-if="formMode=='create'" v-text="client.phrase.button.insert" @click="openInsertConfirm"></v-btn>
            <v-btn :style="client.palette.brownFront" v-if="formMode=='edit'" v-text="client.phrase.button.update" @click="openUpdateConfirm"></v-btn>
          </section>
        </v-card>
      </div>
    </div>

    <!-- 登録確認モーダルダイアログ -->
    <dialog-frame-normal :target="tableDialog.confirmInsert" :title="'登録確認'" :contents="client.phrase.message.confirm.insert">
      <v-btn @click="doInsert" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="tableDialog.confirmInsert = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 登録完了モーダルダイアログ -->
    <dialog-frame-normal :target="tableDialog.completeInsert" :title="'登録完了'" :contents="client.phrase.message.complete.insert">
      <v-btn @click="doReload" :style="client.palette.brownFront" v-text="'リロード'"></v-btn>
    </dialog-frame-normal>

    <!-- 更新確認モーダルダイアログ -->
    <dialog-frame-normal :target="tableDialog.confirmUpdate" :title="'更新確認'" :contents="client.phrase.message.confirm.update">
      <v-btn @click="doUpdate" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="tableDialog.confirmUpdate = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 更新完了モーダルダイアログ -->
    <dialog-frame-normal :target="tableDialog.completeUpdate" :title="'更新完了'" :contents="client.phrase.message.complete.update">
      <v-btn @click="doReload" :style="client.palette.brownFront" v-text="'リロード'"></v-btn>
    </dialog-frame-normal>

    <!-- 利用状況変更確認モーダルダイアログ -->
    <dialog-frame-normal :target="tableDialog.confirmStop" :title="'利用状況変更確認'" :contents="client.phrase.message.confirm.stopAccount">
      <v-btn @click="goToConfirmStop2" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="tableDialog.confirmStop = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 利用状況変更確認モーダルダイアログ２ -->
    <dialog-frame-normal :target="tableDialog.confirmStop2" :title="'利用状況変更確認！'" :contents="client.phrase.message.reConfirmStop">
      <v-btn @click="goToConfirmStop3" :style="client.palette.brownFront" v-text="client.phrase.button.okStop"></v-btn>
      <v-btn @click="tableDialog.confirmStop2 = false" :style="client.palette.brownBack" v-text="client.phrase.button.deleteCancel"></v-btn>
    </dialog-frame-normal>

    <!-- 利用状況変更確認モーダルダイアログ３ -->
    <dialog-frame-normal :target="tableDialog.confirmStop3" :title="'利用状況変更確認！！！'" :contents="client.phrase.message.lastConfirmStop">
      <v-btn @click="doStop" :style="client.palette.brownFront" v-text="client.phrase.button.executeStop"></v-btn>
      <v-btn @click="tableDialog.confirmStop3 = false" :style="client.palette.brownBack" v-text="client.phrase.button.deleteCancel"></v-btn>
    </dialog-frame-normal>

    <!-- 利用状況変更完了モーダルダイアログ -->
    <dialog-frame-normal :target="tableDialog.copleteStop" :title="'利用状況変更完了'" :contents="client.phrase.message.complete.stop">
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
      isNotMailAddress: false,
      validMessage: this.cl.phrase.validation,
      onEditAccountName: false,
      onEditAccountId: false,
      is_teacherStrs: ['一般', '講師'],
      selectItem: {
        id: '',
        name: '',
        login_id: '',
        password: '',
        is_teacher: '',
        is_stopped: '',
        isTeacher_str: '一般',
      },
      tableDialog: {
        confirmInsert: false,
        completeInsert: false,
        confirmUpdate: false,
        completeUpdate: false,
        confirmDelete: false,
        completeDelete: false,
        confirmStop: false,
        confirmStop2: false,
        confirmStop3: false,
        completeStop: false,
      },
      styles: {
        replaceArea: 'display:flex;align-items:baseline;',
        ctred: 'text-align:center;color:red;font-weight:600;cursor:pointer;',
      },
      search: '',
      formMode: 'init', // init:初期状態, create:新規追加, edit:更新
      headers: [
        { text: 'アカウント名', value: 'name', align: 'start' },
        { text: 'ログインID', value: 'login_id' },
        { text: '権限', value: 'isTeacher_str', sortable: false, filterable: false },
        { text: '利用状態', value: 'is_stopped', sortable: false, filterable: false },
        { text: '編集/停止', value: 'editAndStop', sortable: false, filterable: false },
      ],
      items: [],
    };
  },
  created: function () {
    if (this.is_teacher == 1) this.init();
  },
  props: ['id', 'is_teacher', 'cl'],
  methods: {
    // 画面初期表示処理
    async init() {
      this.getAccountInfo();
    },
    getAccountInfo() {
      let data = { search_for: 'list' };

      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      params.append('search_for', data.search_for);

      // ajax通信実行
      axios
        .post('../../server/api/searchAccountGetter.php', params, this.headerObject)
        .then(response => {
          this.items = response.data;
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    insertItem() {
      this.selectItem = {
        id: '',
        name: '',
        login_id: '',
        password: '',
        is_teacher: '',
        is_stopped: '',
        isTeacher_str: '一般',
      };
      this.reset_vFlg();
      this.onEditAccountName = true;
      this.onEditAccountId = true;
      this.formMode = 'create';
    },
    editItem(item) {
      let data = {
        search_for: 'single',
        id: item.id,
      };
      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/searchAccountGetter.php', params, this.headerObject)
        .then(response => {
          this.selectItem.id = item.id;
          this.selectItem.name = item.name;
          this.selectItem.login_id = response.data[0].login_id;
          this.selectItem.is_teacher = response.data[0].is_teacher;
          if (this.selectItem.is_teacher == '1') {
            this.selectItem.isTeacher_str = '講師';
          } else {
            this.selectItem.isTeacher_str = '一般';
          }
          this.reset_vFlg();
          this.onEditAccountName = false;
          this.onEditAccountId = false;
          this.formMode = 'edit';
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    stopItem(item) {
      this.selectItem.id = item.id;
      this.selectItem.is_stopped = item.is_stopped;
      this.tableDialog.confirmStop = true;
    },
    async openInsertConfirm() {
      if (!this.validation()) {
        this.tableDialog.confirmInsert = true;
        await this.judgeAlreadies();
      }
    },
    async openUpdateConfirm() {
      if (!this.validation()) {
        this.tableDialog.confirmUpdate = true;
        await this.judgeAlreadies();
      }
    },
    judgeAlreadies() {
      if (this.selectItem.name != '' && this.onEditAccountName) {
        let data = { name: this.selectItem.name };
        let params = new URLSearchParams();
        params.append('formMode', this.formMode);
        params.append('id', this.id);
        params.append('name', data.name);
        // ajax通信実行
        axios
          .post('../../server/api/accountExistJudge.php', params, this.headerObject)
          .then(response => {
            if (response.data.length != 0) {
              this.v_flg.isExist.name = true;
              this.tableDialog.confirmInsert = false;
              this.tableDialog.confirmUpdate = false;
            }
          })
          .catch(error => alert('通信に失敗しました。'));
      }
      if (this.selectItem.login_id != '' && this.onEditAccountId) {
        let data = { login_id: this.selectItem.login_id };
        let params = new URLSearchParams();
        params.append('formMode', this.formMode);
        params.append('id', this.id);
        params.append('login_id', data.login_id);
        // ajax通信実行
        axios
          .post('../../server/api/accountExistJudge.php', params, this.headerObject)
          .then(response => {
            if (response.data.length != 0) {
              this.v_flg.isExist.loginID = true;
              this.tableDialog.confirmInsert = false;
              this.tableDialog.confirmUpdate = false;
            }
          })
          .catch(error => alert('通信に失敗しました。'));
      }
    },
    validation() {
      let decision = false;
      if (this.selectItem.name == '') {
        this.v_flg.isEmpty.account.name = true;
        decision = true;
      }
      if (this.selectItem.login_id == '') {
        this.v_flg.isEmpty.account.loginID = true;
        decision = true;
      }
      if (this.selectItem.login_id != '') {
        // ログインIDがメールアドレス形式かを判定する
        const loginIDRegex =
          /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
        let result = loginIDRegex.test(this.selectItem.login_id);
        if (!result) {
          this.isNotMailAddress = true;
          decision = true;
        }
      }
      if (this.formMode == 'create' && this.selectItem.password == '') {
        this.v_flg.isEmpty.account.password = true;
        decision = true;
      }
      if (this.selectItem.name.length > 16) {
        this.v_flg.length.account.name = true;
        decision = true;
      }
      if (this.formMode == 'create' && this.selectItem.password != '') {
        // パスワードの形式が正しいかを判定する
        let regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9.?/-]{6,16}$/);
        if (!regex.test(this.selectItem.password)) {
          this.v_flg.isNotPassword = true;
          decision = true;
        }
      }

      return decision;
    },
    doInsert() {
      let numIs_teacher = 0;
      if (this.selectItem.isTeacher_str == '講師') numIs_teacher = 1;
      let data = {
        type: 'insert',
        name: this.selectItem.name,
        login_id: this.selectItem.login_id,
        password: this.selectItem.password,
        is_teacher: numIs_teacher,
        user_id: this.id,
      };
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/accountCRUD.php', params, this.headerObject)
        .then(response => {
          this.tableDialog.confirmInsert = false;
          this.tableDialog.completeInsert = true;
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    doUpdate() {
      let numIs_teacher = 0;
      if (this.selectItem.isTeacher_str == '講師') numIs_teacher = 1;
      let data = {
        type: 'update',
        id: this.selectItem.id,
        name: this.selectItem.name,
        login_id: this.selectItem.login_id,
        is_teacher: numIs_teacher,
        user_id: this.id,
      };
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/accountCRUD.php', params, this.headerObject)
        .then(response => {
          this.tableDialog.confirmUpdate = false;
          this.tableDialog.completeUpdate = true;
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    doStop() {
      let changeIs_stopped = 0;
      if (this.selectItem.is_stopped == 0) changeIs_stopped = 1;
      let data = {
        type: 'stop',
        id: this.selectItem.id,
        is_stopped: changeIs_stopped,
        user_id: this.id,
      };

      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/accountCRUD.php', params, this.headerObject)
        .then(response => {
          this.tableDialog.confirmStop3 = false;
          this.tableDialog.copleteStop = true;
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    goToConfirmStop2() {
      this.tableDialog.confirmStop = false;
      this.tableDialog.confirmStop2 = true;
    },
    goToConfirmStop3() {
      this.tableDialog.confirmStop2 = false;
      this.tableDialog.confirmStop3 = true;
    },
    doReload() {
      setTimeout(function () {
        location.reload();
      }, 1000);
    },
    reset_vFlg() {
      this.v_flg.isEmpty.account.name = false;
      this.v_flg.isEmpty.account.loginID = false;
      this.v_flg.isEmpty.account.password = false;
      this.v_flg.length.account.name = false;
      this.v_flg.isNotPassword = false;
      this.v_flg.isExist.name = false;
      this.v_flg.isExist.loginID = false;
    },
  },
});

export default dataTableForAccount;
