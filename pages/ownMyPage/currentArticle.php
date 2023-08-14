<?php
  session_start();
  $_SESSION['title'] = $_POST['title'];
  $_SESSION['text_array'] = $_POST['text_array'];
  $_SESSION['time'] = $_POST['time'];
  $title = $_SESSION['title'] == null ? 'ノートが登録されていません' : $_SESSION['title'];
  $htmlTitlePlus = $_SESSION['title'] == null ? '' : ' ｜ '.$_SESSION['title'];
  $textArray = $_SESSION['text_array'] == null ? '' : $_SESSION['text_array'];
  $time = $_SESSION['time'] == null ? '' : $_SESSION['time'];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Linker Article<?php echo $htmlTitlePlus ?></title>
  <link rel="icon" href="../../images/favicon.ico">
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" />
  <style>
    body {
      background: #e8d3c7;
      color: #4c4c4c;
      font: 17px verdana,"yu gothic","YuGothic","hiragino kaku gothic pron","メイリオ","Meiryo","sans-serif";
      line-height: 2em;
    }

    #header{
      padding:10px 0 15px;
      overflow:hidden;
      background:#73675e;
    }

    .inner{
      margin:0 auto;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo{ 
      padding:20px 0 0;
      text-align:center;
    }

    .logo a{
      font-size:20px;
      font-weight:bold;
      line-height:1;
      color:#fff;
    }

    .logo span{
      font-size:12px;
      font-weight:normal;
    }

    .dispNone { display: none }

    .fader{
      animation-name:fadeInAnime;
      animation-duration:1s;
    }

    @keyframes fadeInAnime{
      from {opacity: 0}
      to {opacity: 1;}
    }

    @media only screen and (min-width:960px){	
      .inner{
        width:80%;
        padding:0;
      }
    }

    /* モニター幅940px以下 */
    @media only screen and (max-width:940px){
      .logo{padding-left:10px;}
    }

    /* iPad 縦 */
    @media only screen and (max-width:768px){
      .logo{
        float:none;
        text-align:center;
        padding:10px 5px 20px;
      }
    }
  </style>
</head>
<body>
    <!-- Vue Area -->
    <div id="vueForCommon">
      <!-- ヘッダー -->
      <div id="header">
        <div class="inner">
          <div class="logo">
            <img src="../../images/linker_logo.png" alt="" width="240" height="80" :style="styles.linkerLogo" />
            <h2 style="color:chocolate">Article</h2>
          </div>
        </div>
      </div>
      <!-- メインコンテンツ -->
      <div id="main" :style="styles.mg_1em">
        <?php
          echo '<h3 id="fader_1st" class="dispNone" align="center">'.$title.'</h3><br>';
          echo '<p id="fader_2nd" class="dispNone">'.$textArray.'</p><br>';
          echo '<p id="fader_3rd" class="dispNone">'.$time.'</p>';
        ?>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="../../static/js/JQ01_gotoTop.js"></script>
    <script type="module">
      import client from '../../static/js/VJ03_client.js';

      // #vueForCommon内でVue.jsの機能を有効化する
      const common = new Vue({
        el: '#vueForCommon',
        vuetify: new Vuetify(),
        data: function () {
          return {
            client: client,
            styles: {
              linkerLogo: "border: 3px solid #f1a753; border-radius: 5px;",
              widthFlex: 'display:flex;justify-content: space-between;',
              alignItem: 'margin:10px 5px;align-items:center;',
              mg_1em: 'margin: 1em;',
            },
          };
        },
        created: function () {
          this.init();
        },
        methods: {
          // 画面初期表示処理
          async init() {
            setTimeout(() => {
              document.getElementById('fader_1st').classList.remove('dispNone');
              document.getElementById('fader_1st').classList.add('fader');
            }, 100);
            setTimeout(() => {
              document.getElementById('fader_2nd').classList.remove('dispNone');
              document.getElementById('fader_2nd').classList.add('fader');
            }, 400);
            setTimeout(() => {
              document.getElementById('fader_3rd').classList.remove('dispNone');
              document.getElementById('fader_3rd').classList.add('fader');
            }, 700);
          },
        },
      });
    </script>
</body>
</html>