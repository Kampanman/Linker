<?php
include('../db.php');
include('../functions.php');
/**
 * 検索結果出力API
 */

// apiに直接アクセスした場合、画面には0とだけ表示されるように設定
$res = 0;

try {
  // クライアント側から取得してきたパラメータを定義
  $search_for = $_POST["search_for"];

  /**
   * GAWTYボタンとノート・動画一覧の取得
   */
  if ($search_for == "list") {
    // クライアント側から取得してきたパラメータを定義
    $user_id = $_POST["user_id"];
    $keyword = trim(h($_POST["gawty"]));
    $created = trim(h($_POST["created_user"]));
    $term_start = $_POST["term_start"];
    $term_end = $_POST["term_end"];
    $view_count = $_POST["view_count"];
    $plus_contents = $_POST["note_or_video"];
    $and_or = $_POST["and_or"]; // and:0, or:1
    $title_or_body = $_POST["title_or_body"];

    // キーワードがセットされている場合は、レスポンスパラメータに値を設定する
    if (isset($keyword)) {
      // 初期値を設定
      $res = array();
      $res['login'] = false;
      $res['loginuser_id'] = 0;
      $res['search_conditions'] = array(
        "keyword" => $keyword,
        "created" => $created,
        "term_start" => $term_start,
        "term_end" => $term_end,
        "view_count" => $view_count,
        "plus_contents" => $plus_contents,
        "and_or" => $and_or,
        "title_or_body" => $title_or_body,
      );

      // リサルトを初期化
      $res['result'] = array();

      // 個別マイページから検索リクエストを送信した場合は、ログインパラメータを更新
      if (isset($user_id)) {
        $res['login'] = true;
        $res['loginuser_id'] = $user_id;
      }

      // GAWTY検索ボタンのリンクに反映できるように、$keywordの空白を置換する
      $keyword = str_replace("　", " ", $keyword, $num);
      $keyword_intoUrl_plus = str_replace(" ", "+", $keyword, $num);
      $keyword_intoUrl_per20 = str_replace(" ", "%20", $keyword, $num);

      // GAWTYエリアに表示する各ボタンのURLを設定
      $res['result']["gawty"]["google"] = "https://www.google.com/search?q=" . $keyword_intoUrl_plus . "&hl=ja&source=hp";
      $res['result']["gawty"]["allabout"] = "https://search.allabout.co.jp/?q=" . $keyword_intoUrl_plus
        . "#gsc.tab=0&gsc.q=" . $keyword_intoUrl_per20 . "&gsc.page=1";
      if (preg_match("/^[0-9a-zA-Zぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠・ー]*$/", $keyword)) {
        $res['result']["gawty"]["wikipedia"] = "https://ja.wikipedia.org/wiki/" . urlencode($keyword);
      } else {
        // スペース等を含んでいた場合はWikipediaのトップページに移動する
        $res['result']["gawty"]["wikipedia"] = "https://ja.wikipedia.org/wiki/" . urlencode("メインページ");
      }
      $res['result']["gawty"]["twitter"] = "https://twitter.com/search?q=" . $keyword_intoUrl_per20 . "&src=typed_query";
      $res['result']["gawty"]["youtube"] = "https://www.youtube.com/results?search_query=" . $keyword_intoUrl_plus;

      if ($plus_contents == '1') {
        // 登録者名が入力されている場合は、その値を検索条件に含めるようにSQL文を作成
        $createdCondition = "";
        if ($created != "") $createdCondition = "AND acc.name LIKE '%" . $created . "%' ";
        if (isset($user_id) && $_POST["only_own"] == 1) $createdCondition .= "AND acc.id = '" . $user_id . "' ";

        // 表示対象期間が入力されている場合は、その値を検索条件に含めるようにSQL文を作成
        $note_startCondition = "";
        $note_endCondition = "";
        $video_startCondition = "";
        $video_endCondition = "";
        if ($term_start != "") {
          $note_startCondition = "AND notes.created_at >= '" . $term_start . "' ";
          $video_startCondition = "AND videos.created_at >= '" . $term_start . "' ";
        }
        if ($term_end != "") {
          $note_endCondition = "AND notes.created_at <= '" . $term_end . "' ";
          $video_endCondition = "AND videos.created_at <= '" . $term_end . "' ";
        }

        // 複数のキーワードでSQL検索ができるように、$keywordを配列化したものを用意する
        $keyword_array = explode(" ", $keyword);
        for ($i = 0; $i < count($keyword_array); $i++) {
          $keyword_array[$i] = "'%" . $keyword_array[$i] . "%' ";
        };

        // キーワードが、ノートタイトル・ノート本文のどちらに含まれているかで場合分けを行う
        $title_or_body_string = "title";
        if ($title_or_body == "1") $title_or_body_string = "note";
        // キーワードが、動画タイトル・動画タグのどちらに含まれているかで場合分けを行う
        $videoWhich_string = "title";
        if ($title_or_body == "1") $videoWhich_string = "tags";
        $and_or_string = "AND ";
        if ($and_or == "1") $and_or_string = "OR ";
        $note_wordCondition = implode($and_or_string . "notes." . $title_or_body_string . " LIKE ", $keyword_array);
        $video_wordCondition = implode($and_or_string . "videos." . $videoWhich_string . " LIKE ", $keyword_array);

        // コモンページと個別マイページ（一般or講師）とで、WHERE句の場合分けを行う
        $noteWhere = "";
        $videoWhere = "";
        $is_teacher = $_POST["is_teacher"];
        if (isset($user_id) && $is_teacher == 1) {
          $noteWhere = "WHERE (notes.publicity > 0 OR notes.created_user_id = " . $user_id . ")";
          $videoWhere = "WHERE (videos.publicity > 0 OR videos.created_user_id = " . $user_id . ")";
        } else if (isset($user_id) && $is_teacher == 0) {
          $noteWhere = "WHERE (notes.publicity = 1 OR notes.created_user_id = " . $user_id . ")";
          $videoWhere = "WHERE (videos.publicity = 1 OR videos.created_user_id = " . $user_id . ")";
        } else {
          $noteWhere = "WHERE notes.publicity = 1";
          $videoWhere = "WHERE videos.publicity = 1";
        }
        $noteWhere .= " AND acc.is_stopped = 0 " . $createdCondition . $note_startCondition . $note_endCondition;
        $videoWhere .= " AND acc.is_stopped = 0 " . $createdCondition . $video_startCondition . $video_endCondition;

        // 検索条件に合致するノートレコードを取得
        $noteSql = "SELECT notes.id, notes.title, REPLACE(notes.url, '&amp;', '&') as url, acc.is_teacher, 0 as last FROM `linker_notes` notes "
          . "JOIN `linker_accounts` acc on notes.created_user_id = acc.id "
          . $noteWhere . "AND (notes." . $title_or_body_string . " LIKE " . $note_wordCondition . ") ORDER BY notes.updated_at DESC LIMIT " . $view_count;
        $statement = $connection->prepare($noteSql);
        $statement->execute();
        $noteResult = $statement->fetchAll(PDO::FETCH_ASSOC);
        // ※[PDO::FETCH_ASSOC]は、配列内にナンバーインデックスを入れない（カラムデータのみを入れる）為に設定する
        $res['result']["note"] = $noteResult;

        // 検索条件に合致する動画レコードを取得
        $videoSql = "SELECT videos.id, videos.title, videos.tags, videos.url, acc.is_teacher, 0 as last FROM `linker_videos` videos "
          . "JOIN `linker_accounts` acc on videos.created_user_id = acc.id "
          . $videoWhere . "AND (videos." . $videoWhich_string . " LIKE " . $video_wordCondition . ") ORDER BY videos.updated_at DESC LIMIT " . $view_count;
        $statement = $connection->prepare($videoSql);
        $statement->execute();
        $videoResult = $statement->fetchAll(PDO::FETCH_ASSOC);
        $res['result']["video"] = $videoResult;

        $res['result']["note_sql"] = $noteSql;
        $res['result']["video_sql"] = $videoSql;
      }

      $res = json_encode($res);
    }
  }

  /**
   * 個別ノート・動画の取得
   */
  if ($search_for == "single") {
    // クライアント側から取得してきたパラメータを定義
    $id = $_POST["id"];
    $which = $_POST["which"];

    // 初期値を設定
    $res = array();
    $res['result']["id"] = $id;
    $res['result']["which"] = $which;

    if ($which == 'note') {
      // idに対応するノートレコードを取得
      $noteSql_single = "SELECT notes.id, notes.title, REPLACE(notes.url, '&amp;', '&') url, REPLACE(notes.note, '&amp;', '&') note, "
        . "acc.insert_word_1st, acc.insert_word_2nd, acc.insert_word_3rd, "
        . "notes.created_at created, notes.updated_at updated, acc.name author FROM `linker_notes` notes "
        . "JOIN `linker_accounts` acc on notes.created_user_id = acc.id "
        . "WHERE notes.id = " . $id . " LIMIT 1";
      $statement = $connection->prepare($noteSql_single);
      $statement->execute();
      $noteResult = $statement->fetchAll(PDO::FETCH_ASSOC);
      $res['result']["note"] = $noteResult;
    } else {
      // idに対応する動画レコードを取得
      $videoSql_single = "SELECT videos.id, videos.title, videos.tags, videos.url, "
        . "videos.created_at created, videos.updated_at updated, acc.name author FROM `linker_videos` videos "
        . "JOIN `linker_accounts` acc on videos.created_user_id = acc.id "
        . "WHERE videos.id = " . $id . " LIMIT 1";
      $statement = $connection->prepare($videoSql_single);
      $statement->execute();
      $videoResult = $statement->fetchAll(PDO::FETCH_ASSOC);
      $res['result']["video"] = $videoResult;
    };

    $res = json_encode($res);
  }
  // リクエスト先とapi直接アクセス時の画面にはこの値を返す
  echo $res;
} catch (Exception $e) {
  echo $e->getMessage();
}

exit;
