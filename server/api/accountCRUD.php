<?php
include('../db.php');
include('../functions.php');
/**
 * アカウント 登録・更新API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try{

  // クライアント側から取得してきたパラメータを定義
  $type = $_POST["type"];
  $user_id = $_POST["user_id"];
  $id = $_POST["id"];
  $name = h($_POST["name"]);
  $login_id = h($_POST["login_id"]);
  $password = $_POST["password"];
  $comment = h($_POST["comment"]);
  $is_teacher = $_POST["is_teacher"];
  $is_stopped = $_POST["is_stopped"];
  $word1st = h($_POST["insert_word_1st"]);
  $word2nd = h($_POST["insert_word_2nd"]);
  $word3rd = h($_POST["insert_word_3rd"]);

  // パスワードをハッシュ化
  $password = hashpass($password);
  if($type=="insert"){
    
      // アカウントを新規追加
      $insertSql = "INSERT INTO linker_accounts "
      ."(name, login_id, password, is_teacher, created_at, created_user_id, updated_at, updated_user_id) "
      ."VALUES (:name, :login_id, :password, :is_teacher, now(), :created_user_id, now(), :updated_user_id)";

      $statement = $connection->prepare($insertSql);
      $statement->bindValue(':name', $name);
      $statement->bindValue(':login_id', $login_id);
      $statement->bindValue(':password', $password);
      $statement->bindValue(':is_teacher', $is_teacher);
      $statement->bindValue(':created_user_id', $user_id);
      $statement->bindValue(':updated_user_id', $user_id);

      $result = $statement->execute();
      $res = json_encode($result);
  }else if($type=="update"){

    // アカウントを更新
    $updateSql = "UPDATE linker_accounts SET "
    ."name = :name, login_id = :login_id, is_teacher = :is_teacher, "
    ."updated_at = now(), updated_user_id = :updated_user_id WHERE id = ".$id;

    $statement = $connection->prepare($updateSql);
    $statement->bindValue(':name', $name);
    $statement->bindValue(':login_id', $login_id);
    $statement->bindValue(':is_teacher', $is_teacher);
    $statement->bindValue(':updated_user_id', $user_id);

    $result = $statement->execute();
    $res = json_encode($result);
  }else if($type=="self"){

    // ログインユーザーのアカウントを更新
    $updateSql = "UPDATE linker_accounts SET "
    ."name = :name, login_id = :login_id, is_teacher = :is_teacher, password = :password, comment = :comment, "
    ."insert_word_1st = :insert_word_1st, insert_word_2nd = :insert_word_2nd, insert_word_3rd = :insert_word_3rd, "
    ."updated_at = now(), updated_user_id = ".$id." WHERE id = ".$id;
    $statement = $connection->prepare($updateSql);
    $statement->bindValue(':name', $name);
    $statement->bindValue(':login_id', $login_id);
    $statement->bindValue(':is_teacher', $is_teacher);
    $statement->bindValue(':password', $password);
    $statement->bindValue(':comment', $comment);
    $statement->bindValue(':insert_word_1st', $word1st);
    $statement->bindValue(':insert_word_2nd', $word2nd);
    $statement->bindValue(':insert_word_3rd', $word3rd);

    $result = $statement->execute();
    $res = json_encode($result);    
  }else if($type=="nonpass"){

    // ログインユーザーのアカウントを更新
    $updateSql = "UPDATE linker_accounts SET "
    ."name = :name, login_id = :login_id, is_teacher = :is_teacher, "
    ."insert_word_1st = :insert_word_1st, insert_word_2nd = :insert_word_2nd, insert_word_3rd = :insert_word_3rd, "
    ."comment = :comment, updated_at = now(), updated_user_id = ".$id." WHERE id = ".$id;
    $statement = $connection->prepare($updateSql);
    $statement->bindValue(':name', $name);
    $statement->bindValue(':login_id', $login_id);
    $statement->bindValue(':is_teacher', $is_teacher);
    $statement->bindValue(':comment', $comment);
    $statement->bindValue(':insert_word_1st', $word1st);
    $statement->bindValue(':insert_word_2nd', $word2nd);
    $statement->bindValue(':insert_word_3rd', $word3rd);

    $result = $statement->execute();
    $res = json_encode($result);    
  }else{

    // アカウントを停止・再開
    $stopSql = "UPDATE linker_accounts SET "
    ."is_stopped = :is_stopped, stopped_at = now(), stopped_user_id = :stopped_user_id WHERE id = ".$id;
    $statement = $connection->prepare($stopSql);
    $statement->bindValue(':is_stopped', $is_stopped);
    $statement->bindValue(':stopped_user_id', $user_id);

    $result = $statement->execute();
    $res = json_encode($result);
  }

  header("Content-type: application/json; charset=UTF-8");
  echo $res;
}catch(Exception $e){
  echo $e->getMessage();
}