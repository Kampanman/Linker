<?php
include('../db.php');
include('../functions.php');
/**
 * ガチャ動画URL返却API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try{
  // クライアント側から取得してきたパラメータを定義
  $search_for = $_POST["search_for"];
  
  if($search_for == "gachavideo"){
    // 初期値を設定＆リサルトを初期化
    $res = array();
    $res['result'] = array();

    // 動画レコード1件をランダムで取得
    $videoSql_single = "SELECT title, url, "
      ."CASE WHEN tags is null THEN 'なし' ELSE tags END tags "
      ."FROM `linker_videos` video INNER JOIN ("
      ."SELECT CEIL(RAND() * (SELECT MAX(`id`) FROM `linker_videos`)) AS `id`"
    .") AS `tmp` ON video.id >= tmp.id "
    ."WHERE video.publicity = 1 ORDER BY video.id LIMIT 1";
    $statement = $connection->prepare($videoSql_single);
    $statement->execute();
    $videoResult = $statement->fetchAll(PDO::FETCH_ASSOC);
    $res['result']["sql"] = $videoSql_single;
    $res['result']["video"] = $videoResult;
    $res = json_encode($res);
  }
  // リクエスト先とapi直接アクセス時の画面にはこの値を返す
  echo $res;
}catch(Exception $e){
  echo $e->getMessage();
}

exit;