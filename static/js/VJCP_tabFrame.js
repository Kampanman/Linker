/**
 * コンポーネント：タブコンテンツ
 */

let tabFrame = Vue.component('tab-frame', {
  template: `<div class="tabArea">
    <v-app>
      <v-card>
        <v-tabs grow background-color="cyan darken-1" color="yellow accent-2">
          <v-tab v-for="tab in tabs" :key="tab.id" :href="'#tabItem_'+tab.id">{{ tab.name }}</v-tab>
          <v-tab-item value="tabItem_1" transition="fade-transition">
            <div style="margin:5px">
              <br />
              <slot name="tab1" />
            </div>
          </v-tab-item>
          <v-tab-item value="tabItem_2" transition="fade-transition">
            <div style="margin:5px">
              <br />
              <slot name="tab2" />
            </div>
          </v-tab-item>
          <v-tab-item value="tabItem_3" transition="fade-transition">
            <div style="margin:5px">
              <br />
              <slot name="tab3" />
            </div>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-app>
  </div>`,
  data: function () {
    return {
      tabs: [
        // タブに表示するタイトルをIDとともに設定
        {id: 1, name: this.t1},
        {id: 2, name: this.t2},
        {id: 3, name: this.t3},
      ],
    };
  },
  created: function () {
    this.init();
  },
  props: ['t1','t2','t3'],
  methods: {
    // 画面初期表示処理
    async init() {
      //
    },
  },
});

export default tabFrame;