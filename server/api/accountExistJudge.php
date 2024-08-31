<?php
include('../db.php');
include('../functions.php');
/**
 * 既存アカウント情報判定API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try{
  // クライアント側から取得してきたパラメータを定義
  $formMode = $_POST["formMode"];
  $id = $_POST["id"];
  $name = h($_POST["name"]);
  $login_id = h($_POST["login_id"]);
  $judgeSql = "";

  // 新規作成と更新の両方の場合で抽出する
  if($formMode=='create'){
    if(strlen($name)>0 && strlen($login_id)<1) $judgeSql = "SELECT * FROM `linker_accounts` WHERE name LIKE '".$name."'";
    if(strlen($login_id)>0 && strlen($name)<1) $judgeSql = "SELECT * FROM `linker_accounts` WHERE login_id LIKE '".$login_id."'";
  }else{
    if(strlen($name)>0 && strlen($login_id)<1) $judgeSql = "SELECT * FROM `linker_accounts` WHERE name LIKE '".$name."' AND id != ".$id;
    if(strlen($login_id)>0 && strlen($name)<1) $judgeSql = "SELECT * FROM `linker_accounts` WHERE login_id LIKE '".$login_id."' AND id != ".$id;
  }
  if($judgeSql!=""){
    $statement = $connection->prepare($judgeSql);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    $res = json_encode($result);
  }

  // リクエスト先とapi直接アクセス時の画面にはこの値を返す
  echo $res;
}catch(Exception $e){
  echo $e->getMessage();
}

exit;