/**
 * 画面内固定フレーズオブジェクト
 */

let phrase = {
  button: {
    do: "実行",
    cancel: "キャンセル",
    enterNum: "進む",
    deleteDo: "いいから消せ",
    deleteCancel: "やっぱやめとく",
    okStop: "大丈夫だから",
    executeStop: "いいから変えろって！",
  },
  message: {
    confirmDelete: "ホントに削除しますよ？後悔しませんね？",
    reConfirmStop: "ご本人に停止の連絡はされてますか？",
    lastConfirmStop: "後腐れとかありませんね！？",
    initError: "申し訳ありません。必要な情報の取得ができませんでした。",
    loginSuccess: "ログインIDとパスワードの認証に成功しました。",
    loginFail: "ログインIDまたはパスワードが間違っています。",
    stoppedAccount: "そのアカウントは停止されています。",
    logoutConfirm: "ログアウトします。よろしいですか？",
  },
  validation: {
    titleEmpty: empty("タイトル"),
    noteEmpty: empty("ノート本文"),
    accountEmpty: empty("アカウント"),
    loginIDEmpty: empty("ログインID"),
    passwordEmpty: empty("パスワード"),
    videoUrlEmpty: "動画はURL入力が必須です。URLを入力してください。",
    overTitle: over("タイトル", 100),
    overAccount: over("アカウント名", 16),
    rangeOutPassword: range("パスワード", 6, 16),
    urlInvalid: "正しいURLを入力してください。",
    passwordInvalid: "パスワードは形式通りに入力してください。",
    accountAlready: already("アカウント"),
    loginIDAlready: already("ログインID"),
  },  
};

function doType(e){ return `これで${e}する` };
function confirm(e){ return `${e}します。よろしいですか？` };
function comp(e){ return `${e}が完了しました。` };
function empty(e){ return `${e}を入力してください。` };
function over(event, num){ return `${event}の文字数は${num}字以内で入力してください。` };
function less(event, num){ return `${event}の文字数は${num}字以上で入力してください。` };
function range(event, min, max){ return `${event}の文字数は${min}字以上${max}字以内で入力してください。` };
function already(e){ return `その${e}は既に使用されています。` };

phrase.button.insert = doType("登録");
phrase.button.update = doType("更新");
phrase.message.confirm = {
  insert: confirm("登録"),
  update: confirm("更新"),
  stopAccount: confirm("利用状況を変更"),
};
phrase.message.complete = {
  insert: comp("登録"),
  update: comp("更新"),
  delete: comp("削除"),
  stop: comp("利用状況変更"),
};

export default phrase;