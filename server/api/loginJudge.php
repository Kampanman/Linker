<?php
  include('../db.php');
  include('../functions.php');
  session_start();

  $result = 0;
  $login_id = h($_POST['login_id']);
  $password = h($_POST['password']);
  
  if(isset($login_id) && isset($password)){
    $login_idSql = "SELECT * FROM `linker_accounts` WHERE login_id = :login_id";
    $stmt = $connection->prepare($login_idSql);
    $stmt->bindValue(':login_id', $login_id);
    $stmt->execute();
    $member = $stmt->fetch();
    
    if (password_verify($password, $member['password']) && $member['is_stopped'] == 0) {
      //DBのユーザー情報をセッションに保存
      $_SESSION['inSession'] = true;
      $_SESSION['account_id'] = $member['id'];
      $_SESSION['login_id'] = $member['login_id'];
      $_SESSION['password'] = $member['password'];
      $_SESSION['name'] = $member['name'];
      $_SESSION['is_teacher'] = $member['is_teacher'];

      $result = 1;
    }

    if ( $member['is_stopped'] == 1) {
      // 停止中のアカウントだった場合
      $result = -1;
    }
  }

  echo $result;