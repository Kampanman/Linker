/**
 * バリデーションフラグオブジェクト
 */

let validation = {
  
  // 未入力エラー
  isEmpty: {
    // タイトル
    title: false,
    // ノート
    note: false,
    // URL
    url: false,
    // アカウント
    account: {
      // アカウント名
      name: false,
      // ログインID
      loginID: false,
      // パスワード
      password: false,
    },
  },

  // 文字数エラー
  length: {
    // タイトル
    title: false,
    // タグ
    tags: false,
    // アカウント
    account: {
      // アカウント名
      name: false,
      // ログインID
      loginID: false,
      // パスワード
      password: false,
    },
  },

  // URL形式エラー
  isNotUrl: false,
  // パスワード構成エラー
  isNotPassword: false,
  // アカウントが停止中の場合
  isStopped: false,
  // アカウント既存エラー
  isExist: {
    // アカウント名
    name: false,
    // ログインID
    loginID: false,
  },

};

export default validation;
