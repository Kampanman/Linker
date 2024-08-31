/**
 * コンポーネント：フッター
 */

 let linkerFooter = Vue.component('linker-footer', {
  template: `<div id="footer">
    <div class="inner">
      <!-- 3カラム -->
      <section class="gridWrapper">
        <article class="grid">
          <!-- ロゴ -->
          <p class="logo">
            <a href="index.html">
              Company Name<br />
              <span>Your Company Slogan</span>
            </a>
          </p>
          <!-- / ロゴ -->
        </article>

        <article class="grid">
          <!-- 電話番号+受付時間 -->
          <p class="tel">
            電話:
            <strong>012-3456-7890</strong>
          </p>
          <p>受付時間: 平日 AM 10:00 〜 PM 5:00</p>
          <!-- / 電話番号+受付時間 -->
        </article>

        <article class="grid copyright">
          Copyright(c) 2012 Sample Inc. All Rights Reserved. Design by
          <a href="http://f-tpl.com" target="_blank" rel="nofollow">http://f-tpl.com</a>
        </article>
      </section>
      <!-- / 3カラム -->
    </div>
  </div>`,
  data: function () {
    return {
      // 
    };
  },
  created: function () {
    this.init();
  },
  methods: {
    // 画面初期表示処理
    async init() {
      // 
    },
  },
});

export default linkerFooter;