--
-- テーブルのデータのダンプ `linker_videos`（CSVレコード形式）
-- （改行をエンコードした状態でノートをCSVにしてエクスポートするためのSQL）
--
SELECT id, title, url, CASE WHEN tags IS NULL THEN '' ELSE tags END tags, publicity, 
CASE WHEN created_at = '' THEN now() ELSE created_at END created_at, created_user_id 
FROM `linker_videos`