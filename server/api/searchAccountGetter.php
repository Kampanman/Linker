<?php
include('../db.php');
include('../functions.php');
/**
 * アカウント取得API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try{
  // クライアント側から取得してきたパラメータを定義
  $search_for = $_POST["search_for"];
  $accountSql = "SELECT id, name, login_id, comment, is_teacher, insert_word_1st, insert_word_2nd, insert_word_3rd, "
      ."CASE WHEN is_teacher = '1' THEN '講師' ELSE '一般' END isTeacher_str, is_stopped FROM `linker_accounts`";

  if($search_for == "list"){
    // アカウント一覧の取得
    $statement = $connection->prepare($accountSql);
    $statement->execute();
    $accountResult = $statement->fetchAll(PDO::FETCH_ASSOC);
      // ※[PDO::FETCH_ASSOC]は、配列内にナンバーインデックスを入れない（カラムデータのみを入れる）為に設定する
    $res = json_encode($accountResult);
  }else{
    $id = $_POST["id"];
    // 個別アカウントの取得
    $accountSql .= " "."WHERE id = ".$id;
    $statement = $connection->prepare($accountSql);
    $statement->execute();
    $accountResult = $statement->fetchAll(PDO::FETCH_ASSOC);
    $res = json_encode($accountResult);  
  };

  // リクエスト先とapi直接アクセス時の画面にはこの値を返す
  echo $res;
}catch(Exception $e){
  echo $e->getMessage();
}

exit;