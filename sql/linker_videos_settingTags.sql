--
-- 動画レコードにタグを設定できるように規定
--
ALTER TABLE `linker_videos` ADD `tags` VARCHAR(128) NULL DEFAULT NULL COMMENT '動画タグ' AFTER `url`;
ALTER TABLE `linker_videos` CHANGE `title` `title` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '動画タイトル';