<?php 
$res = 0;
$dir_path = "../../csv/";
$account_id = $_POST["account_id"];
$is_teacher = $_POST["is_teacher"];
$filepath = $dir_path.$_POST["filename"];

if(isset($account_id) && isset($is_teacher)){
  $res = array();
  $res = generateCsvToArray($filepath,$account_id,$is_teacher);
  $res = json_encode($res);
}

echo $res;

// csvファイルを読み込み、指定されたワードが含まれている行で絞り込んで配列化
function generateCsvToArray($filepath,$user_id,$is_teacher){
  $csv_file = str_replace(array("\r\n", "\r", "\n"), "\n", file_get_contents($filepath));
  $arrLine = explode("\n", $csv_file);
  $total = count($arrLine);

  $aryCsv = [];
  $count = 0;
  foreach($arrLine as $key => $value){
    if(!$value) continue;
    // ノート本文・動画タグに「,」が含まれている場合に誤って区切られる事を防止
    $re_value_1st = str_replace('","','"^"',$value);
    $re_value_final = str_replace(',,','^^',$re_value_1st);
    $line_array = explode("^", $re_value_final);
    $trimed_line_array = makeLineArray($line_array);
    if(($trimed_line_array["publicity"]=="1" || $trimed_line_array["created_user_id"]==$user_id)
      || ($trimed_line_array["publicity"]=="2" && $is_teacher=="1")
    ){
      $aryCsv[] = $trimed_line_array;
      $count++;
    }
  }

  return array("count"=>$count, "path"=>$filepath, "user_id"=>$str_user_id, "contents"=>$aryCsv);
}

// 各行のカラムから両端の「"」を除去
function makeLineArray($line_array) {
  return array(
    "id" => str_replace('"',"",$line_array[0]),
    "title" => str_replace('"',"",$line_array[1]),
    "publicity" => str_replace('"',"",$line_array[4]),
    "created_user_id" => str_replace('"',"",$line_array[6])
  );
}