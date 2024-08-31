/**
 * コンポーネント：登録更新モードエリア-入力部品
 */

let insertUpdateParts = Vue.component('insert-update-inner', {
  template: `<div>
    <section align="right">
      <v-btn class="mx-2" fab small :style="client.palette.brownBack">×</v-btn>
    </section>
    <section>
      <p>
        <u>
          <li v-if="contents!='account'">{{ client.phrase.validation.urlInvalid }}</li>
          <li v-if="contents=='video'">{{ client.phrase.validation.videoUrlEmpty }}</li>
          <li v-if="contents=='account'">{{ client.phrase.validation.passwordInvlid }}</li>
        </u>
      </p>
      <v-text-field v-for="it of inputSet" 
        :id="it.id" :label="it.label"  :placeholder="it.placeholder" :v-model="it.value" ></v-text-field>
      <div v-if="contents!='account'" style="margin:5px;width:180px;">
        <v-app>
          <v-select :items="items" label="公開設定" v-model="client.form.insertUpdate.noteOrVideo.publish"></v-select>
        </v-app>
      </div><br />
      <div v-if="contents=='note'">
        <v-app><v-textarea outlined :name="variable" label="ノート本文"></v-textarea></v-app>
      </div>
    </section>
    <section align="center">
      <v-btn v-if="type=='insert'" :style="client.palette.brownFront" @click="setParam">
        {{ client.phrase.button.insert }}
      </v-btn>
      <v-btn v-else :style="client.palette.brownFront" @click="setParam">{{ client.phrase.button.update }}</v-btn>
    </section>
  </div>`,
  data: function () {
    return {
      contents: this.con,
      client: this.cl,
      inputSet: this.inputset,
      type: this.tp,
      items: ['非公開', '講師にのみ公開', '公開'],
    };
  },
  created: function () {
    this.init();
  },
  props: ['con', 'tp', 'inputset', 'cl'],
  methods: {
    // 画面初期表示処理
    async init() {
      //
    },
    setParam() {
      console.log(this.client.form.insertUpdate);
    },
  },
});

export default insertUpdateParts;