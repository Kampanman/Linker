<?php
$res = 0;
$dir_path = "../../csv/";
$account_id = $_POST["account_id"];
$is_teacher = $_POST["is_teacher"];
$filepath = $dir_path . $_POST["filename"];
$type = $_POST["type"];
$which = $_POST["which"];
$word = htmlspecialchars($_POST["word"], ENT_QUOTES, 'UTF-8');
$start_date = $_POST["start_date"];
$end_date = $_POST["end_date"];
$limit = $_POST["limit"];

if (isset($account_id) && isset($is_teacher)) {

  if ($type == "index") {
    // csvから、条件に合致するレコード一覧を取得
    if (!empty($word)) {
      $res = generateCsvToArray($filepath, $account_id, $is_teacher, $which, $word, $limit);
      // レコードのidが$account_idに一致するもの以外は非公開を除外
      $regene_array = array();
      $re_count = 0;
      foreach ($res['contents'] as $line) {
        $judge = false;
        if ($start_date != "" && $end_date == "") {
          $strto_date = strtotime($line['created_at']);
          $strto_start = strtotime($start_date);
          $judge = $strto_date > $strto_start;
        } else if ($start_date == "" && $end_date != "") {
          $strto_date = strtotime($line['created_at']);
          $strto_end = strtotime($end_date);
          $judge = $strto_date < $strto_end;
        } else if ($start_date != "" && $end_date != "") {
          $strto_date = strtotime($line['created_at']);
          $strto_start = strtotime($start_date);
          $strto_end = strtotime($end_date);
          $judge = ($strto_date > $strto_start) && ($strto_date < $strto_end);
        } else {
          $judge = true;
        }

        if ($judge == true) {
          $re_count++;
          if ($line['created_user_id'] == $account_id) {
            $regene_array[] = $line;
          } else {
            if ($line['publicity'] == "0") {
              continue;
            } else {
              $regene_array[] = $line;
            }
          }
        }
      }
      unset($res['contents']);
      unset($res['count']);
      $res['contents'] = $regene_array;
      $res['count'] = $re_count;
    }
  } else if ($type == "single") {
    // 画面で選択されたidに合致するレコードのみ取得
    $select_id = $_POST["id"];
    $res = array('type' => $type, 'id' => $select_id, 'contents' => array());
    $res['contents'] = selectCsvData($filepath, $select_id, $which);
  } else if ($type == "csv_files") {
    // ディレクトリ内のcsv一覧を取得
    $csv_array = [];
    foreach (glob($dir_path . "*.csv") as $csv) {
      $csv_name = str_replace($dir_path, "", $csv);
      $csv_array[] = $csv_name;
    }
    $res = array("path" => $dir_path, "index" => $csv_array);
  }
  $res = json_encode($res);
}

echo $res;

// csvファイルの名前を取得し、指定した文字が含まれているか判定
function judgeCsvNameMatch($filepath, $word)
{
  // ファイルのフルパスを指定し、basename関数で名前を取得
  $csv_filename = basename($filepath);
  // ファイル名に指定した文字が含まれているか判定
  $pattern = '/' . $word . '/';
  // マッチしていた場合は1を返す（していなかったら0）
  return preg_match($pattern, $csv_filename);
}

// csvファイルを読み込み、指定されたワードが含まれている行で絞り込んで配列化
function generateCsvToArray($filepath, $user_id, $is_teacher, $which, $word, $limit)
{
  $csv_file = str_replace(array("\r\n", "\r", "\n"), "\n", file_get_contents($filepath));
  $arrLine = explode("\n", $csv_file);
  $total = count($arrLine);

  $aryCsv = [];
  $str_user_id = '"' . $user_id . '"';
  $column_3 = "note";
  if (judgeCsvNameMatch($filepath, "video") == 1) $column_3 = "tags";
  $type = ($column_3 == "note") ? "notes" : "videos";
  $aim_flag = ($which == 'title') ? 0 : 1;
  $count = 0;

  foreach ($arrLine as $key => $value) {
    if ($count == $limit) break;
    if (!$value) continue;
    // ノート本文・動画タグに「,」が含まれている場合に誤って区切られる事を防止
    $re_value_1st = str_replace('","', '"^"', $value);
    $re_value_final = str_replace(',,', '^^', $re_value_1st);
    $line_array = explode("^", $re_value_final);
    $col3_val = ($column_3 = "note") ? "選択後に表示" : str_replace('"', "", $line_array[3]);
    $line_object = makeLineArray($line_array, $column_3, $col3_val);

    $pattern = '/' . $word . '/';
    $array_part = ($aim_flag == 0) ? $line_array[1] : $line_array[3];
    if (preg_match($pattern, $array_part)) {
      if ($line_array[6] == $str_user_id) {
        $aryCsv[] = $line_object;
        $count++;
      } else {
        if ($line_array[4] == "\"0\"") {
          continue;
        } else if ($line_array[4] == "\"2\"") {
          if ($is_teacher == 1) {
            $aryCsv[] = $line_object;
            $count++;
          }
        } else {
          $aryCsv[] = $line_object;
          $count++;
        }
      }
    }
    $array_part = [];
  }
  $resObject = array("type" => $type, "total" => $total, "count" => $count, "path" => $filepath, "contents" => $aryCsv);
  return $resObject;
}

// 指定されたIDでCSVファイル内を検索してレコードを返す
function selectCsvData($filepath, $id, $which)
{
  $column_3 = ($which == "note") ? "note" : "tags";
  $csv_file = str_replace(array("\r\n", "\r", "\n"), "\n", file_get_contents($filepath));
  $arrLine = explode("\n", $csv_file);
  $aryCsv = array();
  foreach ($arrLine as $key => $value) {
    if (!$value) continue;
    // ノート本文・動画タグに「,」が含まれている場合に誤って区切られる事を防止
    $re_value_1st = str_replace('","', '"^"', $value);
    $re_value_final = str_replace(',,', '^^', $re_value_1st);
    $line_array = explode("^", $re_value_final);
    $csv_id = str_replace('"', "", $line_array[0]);
    if ($csv_id == $id) {
      $aryCsv = makeLineArray($line_array, $column_3, $line_array[3]);
      break;
    }
  }
  return $aryCsv;
}

function makeLineArray($line_array, $column_3, $col3_val)
{
  return array(
    "id" => str_replace('"', "", $line_array[0]),
    "title" => str_replace('"', "", $line_array[1]),
    "url" => str_replace(['"', "&amp;"], ["", "&"], $line_array[2]),
    $column_3 => str_replace(["&amp;", "&quot;"], ["&", ""], $col3_val),
    "publicity" => str_replace('"', "", $line_array[4]),
    "created_at" => str_replace('"', "", $line_array[5]),
    "created_user_id" => str_replace('"', "", $line_array[6])
  );
}
