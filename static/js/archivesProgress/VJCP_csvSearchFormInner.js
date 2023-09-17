/**
 * コンポーネント：登録CSV内検索フォーム部品
 */

let csvSearchFormInner = Vue.component('csv-search-inner', {
  template: `<div>
		<div>
			<v-text-field id="searchWord" 
				label="キーワード" 
				placeholder="キーワードを入力してください"
				v-model="searchword"
			></v-text-field>
      <p align="center"><b>※ AND・OR検索はできません</b></p>
		</div>
		<div>
      <section class="widthFlex">
        <label style="margin-right:0.5em"><b>表示対象期間</b></label>
				<div :style="styles.m5px">
					<v-text-field label="開始日" type="date" v-model="start_date" />
				</div>
				<div :style="styles.m5px"><label><b> ～ </b></label></div>
				<div :style="styles.m5px">
					<v-text-field label="終了日" type="date" v-model="end_date" />
				</div>
        <div style="margin-left:1em;margin-right:1em;width:180px;">
          <v-app><v-select :items="count_items" label="表示件数" v-model="view_count"></v-select></v-app>
        </div>
			</section>
			<section :style="styles.flex_center_m5px">
        <label><b>検索対象 </b></label>
        <v-btn v-if="which=='title'" color="primary" dark @click="which='noteOrTags'" :style="color_palette.greenFront + styles.m5px">タイトル内</v-btn>
        <v-btn v-else color="primary" dark @click="which='title'" :style="color_palette.greenBack + styles.m5px">本文中・タグ</v-btn>
			</section>
      <slot />
      <section :style="styles.m5px" align="center">
        <v-btn color="primary" dark @click="doSearch" :style="color_palette.brownFront + styles.m5px" v-if="execute_reload==false">検索実行</v-btn>
        <v-btn color="primary" dark @click="doReload" :style="color_palette.brownBack + styles.m5px" v-if="execute_reload==false">リロード</v-btn>
        <p align="center" v-if="execute_reload==true"><b>リロードしています ...</b></p>
      </section>
		</div>
	</div>`,
  data: function () {
    return {
      login_id: this.session.login_id,
      account_id: this.session.account_id,
      is_teacher: this.session.is_teacher,
      color_palette: this.color,
      start_date: '',
      end_date: '',
      count_items: [10, 50, 100, 500],
      view_count: 10,
      searchword: "",
      which: "title",
      execute_reload: false,
      styles: {
        m5px: "margin:5px;",
        flex_center_m5px: "display:flex;align-items:center;margin:5px;",
      },
    };
  },
  created: function () {
    this.init();
  },
  props: ['session','color'],
  methods: {
    // 画面初期表示処理
    async init() {
      // 
    },
    doSearch() {
      let param = {
        "searchword": this.searchword,
        "start_date": this.start_date,
        "end_date": this.end_date,
        "view_count": this.view_count,
        "which": this.which,
      };
      this.$emit('search-condition', param); //emitでは何故かキャメルケースが使えないので注意
    },
    doReload() {
      this.execute_reload = true;
      // 2秒後にリロードする
      setTimeout(function () {
        location.reload();
      }, 2000);
    },
  },
});

export default csvSearchFormInner;