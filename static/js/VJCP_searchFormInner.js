/**
 * コンポーネント：検索フォーム内部品
 */

let searchFormInner = Vue.component('search-inner', {
  template: `<div>
		<div>
			<v-text-field id="searchWord" 
				label="キーワード" 
				placeholder="キーワードを入力してください"
				v-model="client.form.search.gawty"
			></v-text-field>

			<slot />

			<v-text-field id="searchWord"
				label="登録者" 
				placeholder="登録者名で絞り込みができます"
				v-model="client.form.search.createdUser"
				:class="client.form.search.which.noteOrVideo==1 ? 'fader' : 'none'"
				v-if="client.form.search.which.noteOrVideo==1 && client.form.search.gawty!=''"
			></v-text-field>
		</div>
		<div :class="client.form.search.which.noteOrVideo==1 ? 'fader' : 'none'"
			:style="styles.widthFlex"
			v-if="client.form.search.which.noteOrVideo==1 && client.form.search.gawty!=''">
			<label><b>表示対象期間</b></label>
			<section style="display:flex;margin:5px;align-items:center;">
				<div style="margin:5px">
					<v-text-field label="開始日" type="date" v-model="client.form.search.term.start" />
				</div>
				<div style="margin:5px"><label><b> ～ </b></label></div>
				<div style="margin:5px">
					<v-text-field label="終了日" type="date" v-model="client.form.search.term.end" />
				</div>
			</section>
			<section>
				<div style="margin:5px;width:180px;">
					<v-app><v-select :items="items" label="表示件数" v-model="client.form.search.viewCount"></v-select></v-app>
				</div>
			</section>
			<section style="display:flex;margin:5px;">
				<div style="margin:5px">
					<label><b>ノートの検索対象 </b></label>
					<v-btn v-if="client.form.search.which.titleOrBody==0" :style="client.palette.greenFront" 
						@click="client.form.search.which.titleOrBody = 1">タイトル内</v-btn>
					<v-btn v-else :style="client.palette.greenBack" @click="client.form.search.which.titleOrBody = 0">本文中・タグ</v-btn>
				</div>
				<div style="margin:5px">
					<label><b>検索モード </b></label>
					<v-btn v-if="client.form.search.which.andOr==0" :style="client.palette.purpleFront" 
						@click="client.form.search.which.andOr = 1">AND</v-btn>
					<v-btn v-else :style="client.palette.purpleBack" @click="client.form.search.which.andOr = 0">OR</v-btn>
				</div>
			</section>
		</div><br /><br />
	</div>`,
  data: function () {
    return {
      client: this.prop,
      items: [10, 50, 100, 500],
			styles: { widthFlex: '' },
    };
  },
  created: function () {
    this.init();
  },
  props: ['prop'],
  methods: {
    // 画面初期表示処理
    async init() {
			if(location.href.indexOf("ownMyPage")>-1) this.client.form.search.which.noteOrVideo = 1;
      (window.innerWidth>=1090) ? 
				this.styles.widthFlex = "display: flex;align-items: center;" : this.styles.widthFlex = "";
			this.client.form.search.viewCount = this.items[0];
    },
  },
});

export default searchFormInner;