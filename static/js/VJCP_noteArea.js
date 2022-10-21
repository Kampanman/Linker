/**
 * コンポーネント：ノート一覧・ノート本文エリア
 */

let noteArea = Vue.component('note-area', {
  template: `<div>
    <card-sec-searched :prop="'note'">
      <template #title><tag-title>該当ノート</tag-title></template>
      <template #contents>
        <div align="center" v-if="noteItems.length < 1">
          <span>該当ノートが検出されませんでした。<br />代わりにですが、こちらのノート、どうでしょう？</span><br /><br />
        </div>
        <section align="center" v-if="noteItems.length < 1" id="noteIndex">
          <v-btn id="view_note_1" :style="styles.viewButton" data-id="1" data-which="note" @click="getThisDataId($event)">表示</v-btn>        
        </section>
        <section v-else id="noteIndex"><br />
          <p v-for="item of noteItems" style="display:inline-block;margin-bottom:10px;">
            <span :style="styles.teacherBadge" v-if="item.is_teacher==1">講</span>
            <span v-if="item.url==''" :id="'note_'+item.id">{{ item.title }}</span>
            <span v-else :id="'note_'+item.id">
              <a :href="item.url" style="color:cornflowerblue" target="_blank">{{ item.title }}</a>
            </span>
            <v-btn
              :id="'view_note_'+item.id"
              :style="styles.viewButton"
              :data-id="item.id"
              data-which="note"
              @click="getThisDataId($event)">表示</v-btn>
            <span v-if="item.last==0" style="margin-left:10px;margin-right:10px;"> / </span>
          </p>
        </section>
      </template>
    </card-sec-searched>

    <div v-if="openSection.noteInto" :class="openSection.noteInto==true ? 'fader' : 'none'">
      <card-sec-searched :prop="'noteInner'">
        <template #title><tag-title>ノートの詳細</tag-title></template>
        <template #contents>
          <br />
          <div :style="styles.widthFlex + styles.alignItem">
            <div style="margin-right:10px;margin-bottom:10px;"><label><b>登録者: </b></label><span>{{ noteDetail.author }}</span></div>
            <div style="margin-right:10px;margin-bottom:10px;">
              <v-btn v-if="allToggle==1" :style="client.palette.brownFront" @click="doDownload($event)">ノートをダウンロード</v-btn>
              <v-btn v-if="allToggle==0" :style="client.palette.brownFront" @click="doPartDownload($event)">ノートをダウンロード（部分出力）</v-btn>
            </div>
            <div style="margin-bottom:10px;">
              <label><b>表示一括切替 </b></label>
              <v-btn v-if="allToggle==0" :style="client.palette.blueFront" @click="allOn">ON</v-btn>
              <v-btn v-if="allToggle==1" :style="client.palette.blueBack" @click="allOff">OFF</v-btn>
            </div>
          </div>
          <div :style="styles.alignItem"><label><b>タイトル: </b></label>
            <span v-if="noteDetail.url==''">{{ noteDetail.title }}</span>
            <span v-else><a :href="noteDetail.url" style="color:cornflowerblue" target="_blank">{{ noteDetail.title }}</a></span>
          </div><br />
          <div :style="styles.alignItem">
            <label><b>最終更新: </b></label><span id="updatedDate">{{ noteDetail.updated }}</span>
            <span>　<b>（</b></span>
            <label><b>初回登録: </b></label><span id="createdDate">{{ noteDetail.created }}</span>
            <span><b>）</b></span>
          </div><br />
          <p align="center">
            キーワード入力欄に入力されている文字が含まれるラインが<br />
            ブルーにハイライトされます<br />
            （複数のキーワードを半角空白で繋いでいる場合は無効です）
          </p><br />
          <div :style="styles.alignItem">
            <ul>
              <li style="list-style: none;" v-for="(parts, i) of noteDetail.bodyArray">
                <span v-if="parts.trim().length > 0"
                  :id="'on_'+(i+1)"
                  :data-id="(i+1)"
                  :style="client.palette.blueFront + toggleBadgeStyle"
                  @click="forOn($event)"> ON </span>
                <span v-if="parts.trim().length > 0"
                  :id="'off_'+(i+1)"
                  :data-id="(i+1)"
                  :style="client.palette.blueBack + toggleBadgeStyle"
                  @click="forOff($event)"> OFF </span>
                <span 
                  :id="'line_'+(i+1)" 
                  class="lines visible"
                  :style="(client.form.search.gawty != '' 
                    && client.form.search.gawty.indexOf(' ') == -1
                    && parts.indexOf(client.form.search.gawty)>-1
                  ) ? styles.textEnhance : ''"
                >{{ parts }}</span>
              </li>
            </ul>
          </div>
        </template>
      </card-sec-searched>
    </div>
  </div>`,
  data: function () {
    return {
      headerObject: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      client: this.cl,
      openSection: this.sec,
      styles: this.stl,
      noteItems: this.items,
      noteDetail: '',
      allToggle: 1,
      toggleBadgeStyle:
        'cursor:pointer;margin-right:5px;padding-left:5px;padding-right:5px;' +
        'border-radius:5px;user-select:none;',
    };
  },
  created: function () {
    this.init();
  },
  props: ['cl', 'sec', 'stl', 'items'],
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
          let noteResult = response.data.result.note[0];
          let reCreated = noteResult.created.substring(0, noteResult.created.indexOf(' '));
          let reUpdated = noteResult.updated.substring(0, noteResult.updated.indexOf(' '));
          this.noteDetail = {
            title: noteResult.title,
            url: noteResult.url,
            author: noteResult.author,
            created: reCreated,
            updated: reUpdated,
          };
          this.noteDetail.bodyArray = [];
          let arrayParts = noteResult.note.split('\n');
          arrayParts.forEach(e => this.noteDetail.bodyArray.push(e));

          this.openSection.noteInto = false;
          this.openSection.noteInto = true;
        })
        .catch(error => alert("通信に失敗しました。"));

      if (window.innerWidth >= 480) {
        this.styles.widthFlex = 'display:flex;justify-content: space-between;';
      } else {
        this.styles.widthFlex = 'display:block;justify-content: space-between;';
      }
    },
    forOff(event) {
      let targetId = event.target.dataset.id;
      document.getElementById('line_' + targetId).style.opacity = 0;
      document.getElementById('line_' + targetId).classList.remove('visible');
      this.allToggle = 0;
    },
    forOn(event) {
      let targetId = event.target.dataset.id;
      document.getElementById('line_' + targetId).style.opacity = 1;
      document.getElementById('line_' + targetId).classList.add('visible');
      this.allToggle = 1;
    },
    allOff() {
      let lines = document.querySelectorAll('.lines');
      lines.forEach(e => {
        e.style.opacity = 0;
        e.classList.remove('visible');
      });
      this.allToggle = 0;
    },
    allOn() {
      let lines = document.querySelectorAll('.lines');
      lines.forEach(e => {
        e.style.opacity = 1;
        e.classList.add('visible');
      });
      this.allToggle = 1;
    },
    doDownload(event) {
      try {
        // 画面上に表示されている値をセット
        let fileName = this.noteDetail.title;
        let createdDate = document.getElementById('createdDate').innerText;
        let updatedDate = document.getElementById('updatedDate').innerText;
        let outputText = 'タイトル： ' + fileName + '\n\n';
        outputText += '作成者： ' + this.noteDetail.author + '\n';
        outputText += '初回登録日： ' + createdDate + '\n';
        outputText += '最終更新日： ' + updatedDate + '\n\n';
        let lines = document.querySelectorAll('.lines');
        lines.forEach(e => (outputText += e.innerText + '\n'));
        outputText += '\n\n取得元サイト： ' + location.href;

        // テキストファイルのダウンロード
        const blob = new Blob([outputText], { type: 'text/plain' });
        const aTag = document.createElement('a');
        aTag.href = URL.createObjectURL(blob);
        aTag.target = '_blank';
        aTag.download = fileName;
        aTag.click();
        URL.revokeObjectURL(aTag.href);
        event.target.parentElement.style.display = 'none';
      } catch (e) {
        console.log(e.message);
      }
    },
    doPartDownload(event) {
      try {
        // 画面上に表示されている値をセット
        let fileName = this.noteDetail.title;
        let createdDate = document.getElementById('createdDate').innerText;
        let updatedDate = document.getElementById('updatedDate').innerText;
        let outputText = 'タイトル： ' + fileName + '\n\n';
        outputText += '作成者： ' + this.noteDetail.author + '\n';
        outputText += '初回登録日： ' + createdDate + '\n';
        outputText += '最終更新日： ' + updatedDate + '\n\n';
        let lines = document.querySelectorAll('.visible');
        lines.forEach(e => {
          if (e.style.opacity == 1) outputText += e.innerText + '\n';
        });
        outputText += '\n\n取得元サイト： ' + location.href;

        // テキストファイルのダウンロード
        const blob = new Blob([outputText], { type: 'text/plain' });
        const aTag = document.createElement('a');
        aTag.href = URL.createObjectURL(blob);
        aTag.target = '_blank';
        aTag.download = fileName;
        aTag.click();
        URL.revokeObjectURL(aTag.href);
        event.target.parentElement.style.display = 'none';
      } catch (e) {
        console.log(e.message);
      }
    },
  },
});

export default noteArea;
