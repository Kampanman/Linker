/**
 * コンポーネント：登録CSV用動画一覧・動画フレームエリア
 */

let videoArea = Vue.component('csv-video-area', {
  template: `<div>
    <card-sec-searched :prop="'video'">
      <template #title><tag-title>該当動画</tag-title></template>
      <template #contents>
        <div align="center" v-if="videoItems.length < 1">
          <span>該当動画が検出されませんでした。</span>
        </div>
        <section v-if="videoItems.length > 0" id="videoIndex"><br />
          <p v-for="item of videoItems" style="display:inline-block;margin-bottom:10px;">
            <span :id="'video_'+item.id">{{ item.title }}</span>
            <v-btn
              :id="'view_video_'+item.id"
              :style="styles.viewButton"
              :data-id="item.id"
              data-which="video"
              @click="getThisVideoId($event)">表示</v-btn>
            <span style="margin-left:10px;margin-right:10px;"> / </span>
          </p>
        </section><br />
        <div v-if="openSection_video" :class="openSection_video==true ? 'fader' : 'none'">
          <tag-title>選択された動画</tag-title>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label><span>{{ videoDetail.title }}</span></div>
          <div :style="styles.alignItem"><label><b>登録日: </b></label>{{ videoDetail.created_at }}</div>
          <div v-if="videoDetail.tags!=null" :style="styles.alignItem">
            <label><b>登録タグ: </b></label><span>{{ videoDetail.tags }}</span>
          </div><br />
          <div :style="styles.alignItem">
            <iframe :width="frameSize.width" :height="frameSize.height" 
              :src="videoDetail.url.replace('watch?v=','embed/')"
              title="YouTube video player"
              frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div>
        </div>
      </template>
    </card-sec-searched>
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      openSection_video: false,
      sessionInfo: this.session,
      styles: this.stl,
      videoItems: this.items.contents,
      videoPath: this.items.path,
      videoDetail: {},
      frameSize: { width: 560, height: 315 },
    };
  },
  created: function () {
    this.init();
  },
  props: ['stl', 'session', 'palette', 'items'],
  methods: {
    // 画面初期表示処理
    async init() {
      //
    },
    getThisVideoId(event) {
      this.openSection_video = false;
      let parentEl = event.target.parentElement;
      let dataId = parentEl.dataset.id;
      let filename = this.videoPath.replace(/(.*).\//g, '');
      let data = {
        type: 'single', // list:一覧を取得, single:個別のノートを取得
        account_id: this.sessionInfo.account_id,
        is_teacher: this.sessionInfo.is_teacher,
        filename: filename,
        id: dataId,
        which: parentEl.dataset.which,
      };

      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);

      // ajax通信実行
      axios
        .post('../../server/api/getArrayFromCsv.php', params, this.headerObject)
        .then(response => {
          this.videoDetail = response.data.contents;
          this.videoDetail.tags = response.data.contents.tags.replaceAll('"', '');
          this.videoDetail.filename = filename;
          this.$emit('video-detail', this.videoDetail); //emitでは何故かキャメルケースが使えないので注意
          this.openSection_video = true;
        })
        .catch(error => alert('通信に失敗しました。'));

      const v_area = document.getElementById('videoArea');
      if (window.innerWidth >= 480) {
        this.styles.widthFlex = 'display:flex;justify-content: space-between;';
        this.frameSize.width = v_area.clientWidth - 60;
      } else {
        this.styles.widthFlex = 'display:block;justify-content: space-between;';
        this.frameSize.width = v_area.clientWidth - 30;
      }
      this.frameSize.height = (this.frameSize.width * 9) / 16;
    },
  },
});

export default videoArea;