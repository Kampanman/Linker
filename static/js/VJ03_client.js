import phrase from './VJ01_phrase.js';
import validation from './VJ02_validation.js';
import colorPalette from './VJ04_colorPalette.js';

/**
 * クライアントサイド：設定値オブジェクト
 */

let client = {
  // 個別マイページフラグ
  mypageflg: {
    // 講師権限
    is_teacher: 0,
    // アクティブタブ
    activeTab: 0,
    // 新規追加
    insert: 0,
    // 公開設定
    publish: 1,
  },
  // バリデーションフラグ
  validationflg: validation,
  // 規定色集
  palette: colorPalette,
  // リクエストフォーム
  form: {
    // 認証
    auth: {
      // アカウントID
      accountID: '',
      // アカウント名
      name: '',
      // ログインID
      loginID: '',
      // パスワード
      password: '',
    },
    // 検索内容
    search: {
      // コモンページ：キーワード入力欄の入力値
      gawty: '',
      // 登録者
      createdUser: '',
      // 対象期間
      term: {
        // 開始日
        start: '',
        // 終了日
        end: '',
      },
      which: {
        // 個別マイページ：ノート・動画の入力値
        noteOrVideo: 0,        
        // ノートタイトル・ノート本文選択
        titleOrBody: 0,
        // AND・OR選択
        andOr: 0,
      },
      // 表示件数
      viewCount: '',
    },
    // 登録・更新内容
    insertUpdate: {
      // ノート・動画
      noteOrVideo: {
        // タイトル
        title: '',
        // URL
        url: '',
        // ノート本文
        body: '',
        // 公開フラグ
        publish: 0,
        // 登録・更新者ID
        userID: '',
      },
      // アカウント
      account: {
        // アカウント名
        name: '',
        // ログインID
        loginID: '',
        // パスワード
        password: '',
        // 登録権限
        auth: '',
        // 登録・更新者ID
        userID: '',
      },
    },
  },
  // 画面内固定フレーズ
  phrase: phrase,
  // 読み込み時初期化機能
  init: function () {
    client.mypageflg = null;
    client.method.reset_mypageflg();
    client.method.reset_validationflg();
    client.method.reset_input();
  },
  method: {
    reset_mypageflg: function () {
      // コモンフラグを初期化
      client.mypageflg = {
        search:{noteOrVideo:0,titleOrBody:0,orAnd:0,onlyOwn:0,},auth:0,activeTab:0,insert:0,publish:1,
      };
    },
    reset_validationflg: function () {
      // バリデーションフラグを初期化
      client.mypageflg.validation = {
        isEmpty:{title:false,url:false,account:{name:false,loginID:false,password:false,},},
        length:{title:false,account:{name:false,loginID:false,password:false,},},
        isNotUrl:false,
        isNotPassword:false,
        isExist:{name:false,loginID:false,}
      };
    },
    reset_input: function () {
      // ログインフォームの入力値を初期化
      client.form.auth = {loginID:'',password:'',};
      // 表示件数を除き、検索内容を初期化
      client.form.search = {gawty:'',createdUser:'',term:{start:'',end:'',},which:{noteOrVideo:0,titleOrBody:0,andOr:0,}};
    },
    reset_insertUpdate: function () {
      client.method.reset_validationflg();
      client.form.insertUpdate = {
        noteOrVideo:{title:'',url:'',body:'',publish:0,userID:'',},
        account:{name:'',loginID:'',password:'',auth:'',userID:'',},
      };      
    },
  },
};

export default client;
