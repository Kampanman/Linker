/**
 * コンポーネント：カードセクション（検索後表示エリア用）
 */
 let cardSectionAfterSearch = Vue.component("card-sec-searched", {
  template: `<section class="content" :style="styleCommon + background">
    <slot name="title" />
    <article class="areaContents">
      <slot name="contents" />
    </article>
  </section>`,
  data: function(){
    return {
      styleCommon: "padding:19px;margin-bottom:20px;border:1px solid #ebebeb;border-radius:6px;overflow:hidden;font-size:14px;",
      background: "",
      type: this.prop,
    }
  },
  created: function () {
    this.init();
  },
  props: ['prop'],
  methods: {
    // 画面初期表示処理
    async init() {
      if(this.type == "note"){
        this.background = "background:#bce9e9;";
      }else if(this.type == "noteInner"){
        this.background = "background:#71f4f4;";
      }else if(this.type == "video"){
        this.background = "background:#efdeec;";
      }else if(this.type == "videoInner"){
        this.background = "background:#efdeec;";
      }else{
        this.background = "background:#c4e7c7;";
      }
    },
  },
});

export default cardSectionAfterSearch;