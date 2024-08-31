/**
 * コンポーネント：アカウント個別更新フォーム
 */

let accountSelfEdit = Vue.component('account-self', {
  template: `<div class="fader">
    <v-card style="padding:1em;background:rgb(239, 235, 222);border:1px solid rgb(235, 235, 235);">
      <tag-title>ログインユーザーアカウント</tag-title>
      <div style="padding:1em;">
        <label style="margin-right:0.3em;"><b>アカウント名の編集</b></label>
        <v-btn :style="client.palette.brownFront" v-if="changeValid.account == false" @click="changeValid.account = true">編集を有効にする</v-btn>
        <v-btn :style="client.palette.brownBack" v-if="changeValid.account == true" @click="changeValid.account = false">編集を無効にする</v-btn>
        <v-text-field label="アカウント名" 
          v-if="changeValid.account == true" 
          v-model="selectItem.name" 
          placeholder="アカウント名を入力してください"
          :class="changeValid.account == true ? 'fader' : 'none'"
        ></v-text-field>
      </div>
      <div style="padding:1em;">
        <label style="margin-right:0.3em;"><b>ログインIDの編集</b></label>
        <v-btn :style="client.palette.brownFront" v-if="changeValid.loginID == false" @click="changeValid.loginID = true">編集を有効にする</v-btn>
        <v-btn :style="client.palette.brownBack" v-if="changeValid.loginID == true" @click="changeValid.loginID = false">編集を無効にする</v-btn>
        <v-text-field label="ログインID" 
          v-if="changeValid.loginID == true" 
          v-model="selectItem.login_id" 
          placeholder="ログインID（メールアドレス）を入力してください"
          :class="changeValid.loginID == true ? 'fader' : 'none'"
        ></v-text-field>
      </div>
      <div style="padding:1em;">
        <label style="margin-right:0.3em;"><b>パスワードの編集</b></label>
        <v-btn :style="client.palette.brownFront" v-if="changeValid.password == false" @click="changeValid.password = true">編集を有効にする</v-btn>
        <v-btn :style="client.palette.brownBack" v-if="changeValid.password == true" @click="changeValid.password = false">編集を無効にする</v-btn>
        <v-text-field label="パスワード" 
          v-if="changeValid.password == true" 
          v-model="selectItem.password" 
          placeholder="パスワード（半角英数字混在 6字以上16字以内）を入力してください"
          :class="changeValid.password == true ? 'fader' : 'none'"
        ></v-text-field>
        <v-text-field label="パスワード（確認）" 
          v-if="changeValid.password == true" 
          v-model="selectItem.passwordAgain" 
          placeholder="上と同じパスワードを入力してください"
          :class="changeValid.password == true ? 'fader' : 'none'" 
          oncopy="return false"
        ></v-text-field>
      </div>
      <div style="padding:1em;">
        <v-text-field label="ノート挿入ワード１" v-model="selectItem.insert_word_1st" placeholder="挿入ワードを入力してください（30字以内）"></v-text-field>
        <v-text-field label="ノート挿入ワード２" 
          v-if="selectItem.insert_word_1st!=''" 
          v-model="selectItem.insert_word_2nd" 
          placeholder="挿入ワードを入力してください（30字以内）" 
          :class="(selectItem.insert_word_1st!='') ? 'fader' : 'none'" 
        ></v-text-field>
        <v-text-field label="ノート挿入ワード３" 
          v-if="(selectItem.insert_word_1st!='') && (selectItem.insert_word_2nd!='')" 
          v-model="selectItem.insert_word_3rd" 
          placeholder="挿入ワードを入力してください（30字以内）" 
          :class="(selectItem.insert_word_2nd!='') ? 'fader' : 'none'" 
        ></v-text-field>
      </div>
      <div v-if="selectItem.id!='1'" style="margin:5px;width:180px;">
        <v-app>
          <v-select v-if="selectItem.is_teacher==1 && selectItem.id!=1" label="権限" :items="is_teacherStrs" v-model="selectItem.isTeacher_str"></v-select>
        </v-app>
      </div><br />
      <v-app>
        <v-textarea outlined label="コメント" v-model="selectItem.comment"></v-textarea>
      </v-app>
      <p>
        <ul style="list-style:none;">
          <li :style="styles.ctred" v-if="v_flg.isEmpty.account.name==true" @click="v_flg.isEmpty.account.name=false" v-text="validMessage.accountEmpty"></li>
          <li :style="styles.ctred" v-if="v_flg.isEmpty.account.loginID==true" @click="v_flg.isEmpty.account.loginID=false" v-text="validMessage.loginIDEmpty"></li>
          <li :style="styles.ctred" v-if="v_flg.isEmpty.account.password==true" @click="v_flg.isEmpty.account.password=false" v-text="'パスワード入力欄が両方入力されていません'"></li>
          <li :style="styles.ctred" v-if="isNotMailAddress==true" @click="isNotMailAddress=false" v-text="'ログインIDがメールアドレス形式ではありません'"></li>
          <li :style="styles.ctred" v-if="v_flg.isEmpty.account.name==false && v_flg.length.account.name==true" @click="v_flg.length.account.name=false" v-text="validMessage.overAccount"></li>
          <li :style="styles.ctred" v-if="v_flg.isNotPassword==true" @click="v_flg.isNotPassword=false" v-text="validMessage.passwordInvalid"></li>
          <li :style="styles.ctred" v-if="v_flg.isEmpty.account.name==false && v_flg.isExist.name==true" @click="v_flg.isExist.name=false" v-text="validMessage.accountAlready"></li>
          <li :style="styles.ctred" v-if="v_flg.isEmpty.account.loginID==false && v_flg.isExist.loginID==true" @click="v_flg.isExist.loginID=false" v-text="validMessage.loginIDAlready"></li>
        </ul>
      </p>
      <section align="center">
      <v-btn :style="client.palette.brownFront" v-text="client.phrase.button.update" @click="openUpdateConfirm"></v-btn>
      </section>
    </v-card>
    <br />

    <!-- 更新確認モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.confirmUpdate" :title="'更新確認'" :contents="client.phrase.message.confirm.update">
      <v-btn @click="doUpdate" :style="client.palette.brownFront" v-text="client.phrase.button.do"></v-btn>
      <v-btn @click="dialog.confirmUpdate = false" :style="client.palette.brownBack" v-text="client.phrase.button.cancel"></v-btn>
    </dialog-frame-normal>

    <!-- 更新完了モーダルダイアログ -->
    <dialog-frame-normal :target="dialog.completeUpdate" :title="'更新完了'" :contents="client.phrase.message.complete.update">
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
      is_teacherStrs: ['一般', '講師'],
      selectItem: {
        id: '',
        name: '',
        login_id: '',
        password: '',
        passwordAgain: '',
        is_teacher: '',
        isTeacher_str: '一般',
        comment: '',
        insert_word_1st: '',
        insert_word_2nd: '',
        insert_word_3rd: '',
      },
      changeValid: {
        account: false,
        loginID: false,
        password: false,
      },
      dialog: {
        confirmUpdate: false,
        completeUpdate: false,
      },
      styles: {
        ctred: 'text-align:center;color:red;font-weight:600;cursor:pointer;',
      },
    };
  },
  created: function () {
    this.init();
  },
  props: ['id', 'cl'],
  methods: {
    // 画面初期表示処理
    async init() {
      this.reset_vFlg();
      this.getAccountInfo();
    },
    getAccountInfo() {
      // axiosでPHPのAPIにパラメータを送信する場合は、次のようにする
      let params = new URLSearchParams();
      params.append('search_for', 'self');
      params.append('id', this.id);
      // ajax通信実行
      axios
        .post('../../server/api/searchAccountGetter.php', params, this.headerObject)
        .then(response => {
          let res = response.data[0];
          this.selectItem.id = res.id;
          this.selectItem.name = res.name;
          this.selectItem.login_id = res.login_id;
          this.selectItem.is_teacher = res.is_teacher;
          this.selectItem.isTeacher_str = res.isTeacher_str;
          this.selectItem.comment = res.comment;
          this.selectItem.insert_word_1st = res.insert_word_1st == null ? '' : res.insert_word_1st;
          this.selectItem.insert_word_2nd = res.insert_word_2nd == null ? '' : res.insert_word_2nd;
          this.selectItem.insert_word_3rd = res.insert_word_3rd == null ? '' : res.insert_word_3rd;
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    async openUpdateConfirm() {
      if (!this.validation()) {
        this.dialog.confirmUpdate = true;
        await this.judgeAlreadies();
      }
    },
    judgeAlreadies() {
      if (this.changeValid.account == true && this.selectItem.name != '') {
        let data = { name: this.selectItem.name };
        let params = new URLSearchParams();
        params.append('name', data.name);
        // ajax通信実行
        axios
          .post('../../server/api/accountExistJudge.php', params, this.headerObject)
          .then(response => {
            if (response.data.length != 0) {
              this.v_flg.isExist.name = true;
              this.dialog.confirmUpdate = false;
            }
          })
          .catch(error => alert('通信に失敗しました。'));
      }
      if (this.changeValid.loginID == true && this.selectItem.login_id != '') {
        let data = { login_id: this.selectItem.login_id };
        let params = new URLSearchParams();
        params.append('login_id', data.login_id);
        // ajax通信実行
        axios
          .post('../../server/api/accountExistJudge.php', params, this.headerObject)
          .then(response => {
            if (response.data.length != 0) {
              this.v_flg.isExist.loginID = true;
              this.dialog.confirmUpdate = false;
            }
          })
          .catch(error => alert('通信に失敗しました。'));
      }
    },
    validation() {
      let decide = false;
      if (this.changeValid.account == true && this.selectItem.name == '') {
        this.v_flg.isEmpty.account.name = true;
        decide = true;
      }
      if (this.changeValid.loginID == true && this.selectItem.login_id == '') {
        this.v_flg.isEmpty.account.loginID = true;
        decide = true;
      }
      if (
        this.changeValid.password == true &&
        (this.selectItem.password == '' || this.selectItem.password == '')
      ) {
        this.v_flg.isEmpty.account.password = true;
        decide = true;
      }
      if (this.changeValid.loginID == true && this.selectItem.login_id != '') {
        // ログインIDがメールアドレス形式かを判定する
        const loginIDRegex =
          /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
        let result = loginIDRegex.test(this.selectItem.login_id);
        if (!result) {
          this.isNotMailAddress = true;
          decide = true;
        }
      }
      if (this.changeValid.account == true && this.selectItem.name.length > 16) {
        this.v_flg.length.account.name = true;
        decide = true;
      }
      if (this.changeValid.password == true && this.selectItem.password != '') {
        // パスワードの形式が正しいかを判定する
        let regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9.?/-]{6,16}$/);
        if (!regex.test(this.selectItem.password)) {
          this.v_flg.isNotPassword = true;
          decide = true;
        }
      }
      return decide;
    },
    doUpdate() {
      let numIs_teacher = 0;
      if (this.selectItem.isTeacher_str == '講師') numIs_teacher = 1;
      let data = {
        id: this.selectItem.id,
        name: this.selectItem.name,
        login_id: this.selectItem.login_id,
        password: this.selectItem.password,
        is_teacher: numIs_teacher,
        comment: this.selectItem.comment,
        insert_word_1st: this.selectItem.insert_word_1st,
        insert_word_2nd: this.selectItem.insert_word_2nd,
        insert_word_3rd: this.selectItem.insert_word_3rd,
      };
      this.changeValid.password == true ? (data.type = 'self') : (data.type = 'nonpass');
      console.log('data', data);
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/accountCRUD.php', params, this.headerObject)
        .then(response => {
          this.dialog.confirmUpdate = false;
          this.dialog.completeUpdate = true;
        })
        .catch(error => alert('通信に失敗しました。'));
    },
    doReload() {
      setTimeout(function () {
        location.reload();
      }, 1000);
    },
    reset_vFlg() {
      this.v_flg.isEmpty.account.name = false;
      this.v_flg.isEmpty.account.loginID = false;
      this.v_flg.length.account.name = false;
      this.v_flg.isNotPassword = false;
      this.v_flg.isExist.name = false;
      this.v_flg.isExist.loginID = false;
    },
  },
});

export default accountSelfEdit;
