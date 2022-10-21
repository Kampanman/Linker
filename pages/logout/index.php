<?php
  include('../../server/properties.php');
  session_start();

  $_SESSION = array(); //セッションの中身をすべて削除
  session_destroy(); //セッションを終了する

?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Linker<?php echo $echoUser ?> | ログアウト</title>
  <link rel="icon" href="../../images/favicon.ico">
</head>
<body style="background:#8ea99b;">
  <h1><br></h1>
  <h1 style="color:rgb(252, 226, 236);text-shadow:rgb(10 175 230) 0px 0px 20px;" align="center">
    <span>ログアウトしました<br />コモンページに戻ります</span>
  </h1>
<script>
  setTimeout(function(){
    location.href = '../commonPage/index.php';
  }, 3000);
</script>
</body>
</html>