/**
 * コンポーネント：登録CSV用データテーブル
 */

let dataTableForCsv = Vue.component('table-csv', {
  template: `<div style="padding:1em">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="6">
            <tag-title>
              <span v-text="card_title"></span>
            </tag-title>
          </v-col>
        </v-row>
        <v-col cols="6" style="text-align:right">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="検索ワードを入力してください"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-card-title>
      <v-card-title>
        <div v-if="selectedItem!=''" class="fader" style="margin:0 auto;">
          <span v-text="selectedItem + ' を選択中'"></span>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.select="{ item }">
          <v-btn color="primary" dark small v-text="'選択'" @click="selectThis(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      card_title: "ノート・動画CSV一覧",
      login_id: this.session.login_id,
      account_id: this.session.account_id,
      is_teacher: this.session.is_teacher,
      selectedItem: "",
      headers: [
        { text: "タイトル", value: "title", align: "start" },
        { text: "選択", value: "select", sortable: false, filterable: false, width: "10%" },
      ],
      items: [],
      search: "",
    };
  },
  created: function () {
    this.init();
  },
  props: ['session'],
  methods: {
    // 画面初期表示処理
    async init() {
      this.csvNameLoadAxios();
    },
    csvNameLoadAxios() {
      let data = {
        type: "csv_files",
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
        .post('../../server/api/getArrayFromCsv.php', params, this.headerObject)
        .then(response => {
          let index_array = response.data.index;
          for (let i in index_array) {
            this.items.push({"title":index_array[i], "select":false});
          }
        }).catch(error => alert("通信に失敗しました。"));            
    },
    selectThis(item) {
      this.selectedItem = item.title;
      this.$emit('selected-csv',item.title); //emitでは何故かキャメルケースが使えないので注意
    },
  },
});

export default dataTableForCsv;