/**
 * コンポーネント：CSV内登録レコード参照用データテーブル
 */

let dataTableForCsv_inner = Vue.component('table-csv-inner', {
  template: `<div style="padding:1em">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="6">
            <tag-title>
              <span v-text="card_title"></span>
            </tag-title>
          </v-col>
          <v-col cols="6" style="text-align:right">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="検索ワードを入力してください"
              single-line hide-details
            ></v-text-field>
          </v-col>
        </v-row><br />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.select="{ item }">
          <v-btn 
            v-if="selected==false && (item.created_user_id==account_id || account_id=='1')" 
            color="primary" dark small v-text="'編集'" 
            :data-id="item.id" 
            :data-which="which" 
            @click="selectThis($event)"></v-btn>
        </template>
      </v-data-table><br />
    </v-card>
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      card_title: "CSV内登録レコード一覧",
      login_id: this.session.login_id,
      account_id: this.session.account_id,
      is_teacher: this.session.is_teacher,
      filename: "",
      which: "",
      headers: [
        { text: "ID", value: "id", width: "20%" },
        { text: "タイトル", value: "title", align: "start" },
        { text: "選択", value: "select", sortable: false, filterable: false, width: "10%" },
      ],
      items: [],
      search: "",
      selected: false,
    };
  },
  created: function () {
    this.init();
  },
  props: ['session','palette','file'],
  methods: {
    // 画面初期表示処理
    async init() {
      this.filename = this.file;
      (this.filename.indexOf("note") > -1) ? this.which = "note" : this.which = "video";
      this.csvNameLoadAxios();
    },
    csvNameLoadAxios() {
      let data = {
        filename: this.filename,
        account_id: this.account_id,
        is_teacher: this.is_teacher,
      };

      // axiosでPHPのAPIにパラメータを送信する為、次のようにする
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/getArrayFromCsvInner.php', params, this.headerObject)
        .then(response => {
          this.items = response.data.contents;
        }).catch(error => alert("通信に失敗しました。"));
    },
    selectThis(event) {
      let data = {
        type: 'single',
        filename: this.filename,
        id: event.target.dataset.id,
        which: event.target.dataset.which,
        account_id: this.account_id,
        is_teacher: this.is_teacher,
      }
      this.selected = true;
      this.$emit('select-one',data); //emitでは何故かキャメルケースが使えないので注意
    },
  },
});

export default dataTableForCsv_inner;