<?php
include('../db.php');
include('../functions.php');
/**
 * ログインユーザー登録ノート取得API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try{
  // クライアント側から取得してきたパラメータを定義
  $user_id = $_POST["user_id"];
  $which = $_POST["which"];
  
  if(isset($which)){
    // 初期値を設定
    $res = array();
    if($which=="note"){
      // 検索条件に合致するノートレコードを取得
      $noteSql = "SELECT id, title, publicity, ".
      "CASE WHEN publicity = '1' THEN '公開' WHEN publicity = '2' THEN '講師にのみ公開' ELSE '非公開' END pub_str, created_at "
      ."FROM `linker_notes` WHERE created_user_id = ".$user_id." ORDER BY updated_at DESC";
      $statement = $connection->prepare($noteSql);
      $statement->execute();
      $noteResult = $statement->fetchAll(PDO::FETCH_ASSOC);
        // ※[PDO::FETCH_ASSOC]は、配列内にナンバーインデックスを入れない（カラムデータのみを入れる）為に設定する
      $res = json_encode($noteResult);
    }else{
      // 検索条件に合致する動画レコードを取得
      $videoSql = "SELECT id, title, tags, publicity, ".
      "CASE WHEN publicity = '1' THEN '公開' WHEN publicity = '2' THEN '講師にのみ公開' ELSE '非公開' END pub_str, created_at "
      ."FROM `linker_videos` WHERE created_user_id = ".$user_id." ORDER BY updated_at DESC";
      $statement = $connection->prepare($videoSql);
      $statement->execute();
      $videoResult = $statement->fetchAll(PDO::FETCH_ASSOC);
      $res = json_encode($videoResult);  
    }
  }
  echo $res;
}catch(Exception $e){
  echo $e->getMessage();
}

exit;