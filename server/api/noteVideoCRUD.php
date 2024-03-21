<?php
include('../db.php');
include('../functions.php');

/**
 * ノート・動画レコード 登録・更新API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;
$lostIds = array();

try {
  $tables = array("linker_notes", "linker_videos");
  foreach ($tables as $table) {
    $lostIdSql = getSqlOfGetLostId("id", $table);
    $statement = $connection->prepare($lostIdSql);
    $statement->execute();
    $idResult = $statement->fetchAll(PDO::FETCH_ASSOC)[0]['target_id'];
    $lostIds[$table] = $idResult;
  }
} catch (Exception $e) {
  $lostIds = "";
  $lostIds = $e->getMessage();
}

try {
  // クライアント側から取得してきたパラメータを定義
  $user_id = $_POST["user_id"];
  $type = $_POST["type"];
  $which = $_POST["which"];
  $id = $_POST["id"];
  $title = h($_POST["title"]);
  $tags = h($_POST["tags"]);
  $url = h($_POST["url"]);
  $publicity = $_POST["publicity"];

  if ($which == "note") {
    $note = h($_POST["note"]);

    if ($type == "insert") {
      // ノートレコードを新規追加
      $noteInsertSql = "INSERT INTO linker_notes "
        . "(id, title, url, note, publicity, created_at, created_user_id, updated_at, updated_user_id) "
        . "VALUES (:id, :title, :url, :note, :publicity, now(), :created_user_id, now(), :updated_user_id)";
      $statement = $connection->prepare($noteInsertSql);
      $statement->bindValue(':id', $lostIds['linker_notes']);
      $statement->bindValue(':title', $title);
      $statement->bindValue(':url', $url);
      $statement->bindValue(':note', $note);
      $statement->bindValue(':publicity', $publicity);
      $statement->bindValue(':created_user_id', $user_id);
      $statement->bindValue(':updated_user_id', $user_id);

      $result = $statement->execute();
      $res = json_encode($result);
    } else if ($type == "update") {
      // ノートレコードを更新
      $noteUpdateSql = "UPDATE linker_notes SET "
        . "title = :title, url = :url, note = :note, publicity = :publicity, "
        . "updated_at = now(), updated_user_id = :updated_user_id "
        . "WHERE id = " . $id;
      $statement = $connection->prepare($noteUpdateSql);
      $statement->bindValue(':title', $title);
      $statement->bindValue(':url', $url);
      $statement->bindValue(':note', $note);
      $statement->bindValue(':publicity', $publicity);
      $statement->bindValue(':updated_user_id', $user_id);

      $result = $statement->execute();
      $res = json_encode($result);
    } else {
      // ノートレコードを削除
      $noteDeleteSql = "DELETE FROM `linker_notes` WHERE id = " . $id;
      $statement = $connection->prepare($noteDeleteSql);

      $result = $statement->execute();
      $res = json_encode($result);
    }
  } else {
    if ($type == "insert") {
      // 動画レコードを新規追加
      $videoInsertSql = "INSERT INTO linker_videos "
        . "(id, title, tags, url, publicity, created_at, created_user_id, updated_at, updated_user_id) "
        . "VALUES (:id, :title, :tags, :url, :publicity, now(), :created_user_id, now(), :updated_user_id)";
      $statement = $connection->prepare($videoInsertSql);
      $statement->bindValue(':id', $lostIds['linker_videos']);
      $statement->bindValue(':title', $title);
      $statement->bindValue(':tags', $tags);
      $statement->bindValue(':url', $url);
      $statement->bindValue(':publicity', $publicity);
      $statement->bindValue(':created_user_id', $user_id);
      $statement->bindValue(':updated_user_id', $user_id);

      $result = $statement->execute();
      $res = json_encode($result);
    } else if ($type == "update") {
      // 動画レコードを更新
      $videoUpdateSql = "UPDATE linker_videos SET "
        . "title = :title, tags = :tags, url = :url, publicity = :publicity, "
        . "updated_at = now(), updated_user_id = :updated_user_id "
        . "WHERE id = " . $id;
      $statement = $connection->prepare($videoUpdateSql);
      $statement->bindValue(':title', $title);
      $statement->bindValue(':tags', $tags);
      $statement->bindValue(':url', $url);
      $statement->bindValue(':publicity', $publicity);
      $statement->bindValue(':updated_user_id', $user_id);

      $result = $statement->execute();
      $res = json_encode($result);
    } else {
      // 動画レコードを削除
      $videoDeleteSql = "DELETE FROM `linker_videos` WHERE id = " . $id;
      $statement = $connection->prepare($videoDeleteSql);

      $result = $statement->execute();
      $res = json_encode($result);
    }
  }

  header("Content-type: application/json; charset=UTF-8");
  echo $res;
} catch (Exception $e) {
  echo $e->getMessage();
}

// 欠番のID値を取得するためのSQL文を生成
function getSqlOfGetLostId($idColumn, $tableName)
{
  $getIdSql = "SELECT MIN(a.`" . $idColumn . "`) + 1 'target_id' FROM `" . $tableName . "` a "
    . "LEFT OUTER JOIN `" . $tableName . "` b ON a.`" . $idColumn . "` + 1 = b.`" . $idColumn . "` "
    . "WHERE b.`" . $idColumn . "` IS NULL";
  return $getIdSql;
}
