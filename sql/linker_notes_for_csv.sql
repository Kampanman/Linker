--
-- テーブルのデータのダンプ `linker_notes`（CSVレコード形式）
-- （改行をエンコードした状態でノートをCSVにしてエクスポートするためのSQL）
--
SELECT id, title,  CASE WHEN url IS NULL THEN '' ELSE url END url, 
REPLACE(REPLACE(note,'\r\n','\\r\\n'),'\n','\\n') note, publicity, 
CASE WHEN created_at = '' THEN now() ELSE created_at END created_at, created_user_id FROM `linker_notes`