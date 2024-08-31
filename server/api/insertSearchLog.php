<?php
include('../db.php');
include('../functions.php');
/**
 * 検索ワードログ登録API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try{
  // クライアント側から取得してきたパラメータを定義
  $user_id = $_POST["user_id"];
  $word = h($_POST["word"]);

  // 登録者IDが $user_id と一致するノートレコードの有無をチェック
  $noteCountSql = "SELECT count(*) count FROM `linker_notes` "
    ."WHERE title LIKE '%検索ワードログ%' AND created_user_id = ".$user_id;
  $statement = $connection->prepare($noteCountSql);
  $statement->execute();
  $result = $statement->fetch(PDO::FETCH_ASSOC);
  $count = intval($result["count"]);
  
  if($count<1){
    // ログイン中のユーザーのIDからユーザ名を取得
    $userSql = "SELECT name FROM `linker_accounts` WHERE id = ".$user_id;
    $statement = $connection->prepare($userSql);
    $statement->execute();
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    $user_name = $result["name"];

    $insertTitle = $user_name." 殿の検索ワードログ";
    
    // 検索結果ログレコードを新規追加
    $logInsertSql = "INSERT INTO linker_notes "
      ."(title, url, note, publicity, created_at, created_user_id, updated_at, updated_user_id) "
      ."VALUES (:title, '', :note, :publicity, now(), :created_user_id, now(), :updated_user_id)";
    $statement = $connection->prepare($logInsertSql);
    $statement->bindValue(':title', $insertTitle);
    $statement->bindValue(':note', $word);
    $statement->bindValue(':publicity', 0);
    $statement->bindValue(':created_user_id', $user_id);
    $statement->bindValue(':updated_user_id', $user_id);
    
    $result = $statement->execute();
    $res = json_encode($result);

  }else{
    $checkBiteSql = "SELECT LENGTH(note) bite FROM `linker_notes` "
      ."WHERE title LIKE '%検索ワードログ%' AND created_user_id = ".$user_id;
    $checkStatement = $connection->prepare($checkBiteSql);
    $checkStatement->execute();
    $checkResult = $checkStatement->fetch(PDO::FETCH_ASSOC);

    if($checkResult['bite'] > 65000){
      $res = "OVER";
    }else{
      // 検索結果ログレコードに検索結果を追加して更新
      $logUpdateSql = "UPDATE linker_notes SET note = concat(note, :note), updated_at = now() "
        ."WHERE title LIKE '%検索ワードログ%' AND created_user_id = ".$user_id;
      $statement = $connection->prepare($logUpdateSql);
      $statement->bindValue(':note', $word);
      
      $result = $statement->execute();
      $res = json_encode($result);
    }
  }

  header("Content-type: application/json; charset=UTF-8");
  echo $res;
}catch(Exception $e){
  echo $e->getMessage();
}

exit;