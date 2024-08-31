/**
 * コンポーネント：動画一覧・動画フレームエリア
 */

let videoArea = Vue.component('video-area', {
  template: `<div>
    <card-sec-searched :prop="'video'">
      <template #title><tag-title>該当動画</tag-title></template>
      <template #contents>
        <div align="center" v-if="videoItems.length < 1">
          <span>該当動画が検出されませんでした。<br />代わりにですが、こちらの動画、どうでしょう？</span><br /><br />
        </div>
        <section align="center" v-if="videoItems.length < 1" id="videoIndex">
          <v-btn id="view_video_1" :style="styles.viewButton" data-id="1" data-which="video" @click="getThisDataId($event)">表示</v-btn>        
        </section>
        <section v-else id="videoIndex"><br />
          <p v-for="item of videoItems" style="display:inline-block;margin-bottom:10px;">
            <span :style="styles.teacherBadge" v-if="item.is_teacher==1">講</span>
            <span :id="'video_'+item.id">{{ item.title }}</span>
            <v-btn
              :id="'view_video_'+item.id"
              :style="styles.viewButton"
              :data-id="item.id"
              data-which="video"
              @click="getThisDataId($event)">表示</v-btn>
            <span v-if="item.last==0" style="margin-left:10px;margin-right:10px;"> / </span>
          </p>
        </section><br /><br />
        <div v-if="openSection.videoInto" :class="openSection.videoInto==true ? 'fader' : 'none'">
          <tag-title>選択された動画</tag-title>
          <div :style="styles.alignItem">
            <label><b>登録者: </b></label><span>{{ videoDetail.author }}</span>
          </div>
          <div v-if="videoDetail.tags!=null" :style="styles.alignItem">
            <label><b>登録タグ: </b></label><span>{{ videoDetail.tags }}</span>
          </div>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label><span>{{ videoDetail.title }}</span></div>
          <div :style="styles.alignItem">
            <label><b>最終更新: </b></label><span>{{ videoDetail.updated }}</span>
            <span>　<b>（</b></span>
            <label><b>初回登録: </b></label><span>{{ videoDetail.created }}</span>
            <span><b>）</b></span>
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
      openSection: this.sec,
      styles: this.stl,
      videoItems: this.items,
      videoDetail: {},
      frameSize: { width: 560, height: 315 },
    };
  },
  created: function () {
    this.init();
  },
  props: ['sec','stl','items'],
  methods: {
    // 画面初期表示処理
    async init() {
      // 
    },
    getThisDataId(event) {
      let parentEl = event.target.parentElement;
      let dataId = parentEl.dataset.id;
      let data = {
        search_for: 'single', // list:一覧を取得, single:個別のノート・動画を取得
        id: dataId,
        which: parentEl.dataset.which,
      };
      let params = new URLSearchParams();
      Object.keys(data).forEach(function (key) {
        params.append(key, this[key]);
      }, data);
      // ajax通信実行
      axios
        .post('../../server/api/searchGetter.php', params, this.headerObject)
        .then(response => {
          let videoResult = response.data.result.video[0];
          let reCreated = videoResult.created.substring(0, videoResult.created.indexOf(" "));
          let reUpdated = videoResult.updated.substring(0, videoResult.updated.indexOf(" "));
          this.videoDetail = {
            title: videoResult.title,
            url: videoResult.url,
            tags: videoResult.tags,
            author: videoResult.author,
            created: reCreated,
            updated: reUpdated,
          };
          this.openSection.videoInto = false;
          this.openSection.videoInto = true;
        })
        .catch(error => alert("通信に失敗しました。"));
      const v_area = document.getElementById('videoArea');
      if(window.innerWidth>=480){
        this.styles.widthFlex = "display:flex;justify-content: space-between;";
        this.frameSize.width = v_area.clientWidth - 60;
      }else{
        this.styles.widthFlex = "display:block;justify-content: space-between;";
        this.frameSize.width = v_area.clientWidth - 30;
      }
      this.frameSize.height = this.frameSize.width * 9 / 16;
    },
  },
});

export default videoArea;