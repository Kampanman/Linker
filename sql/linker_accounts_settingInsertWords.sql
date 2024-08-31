-- ノート作成画面でボタン押下により挿入できる、独自キーワード用カラム３種
ALTER TABLE `linker_accounts` 
ADD `insert_word_1st` VARCHAR(30) NULL DEFAULT '' COMMENT 'ユーザー独自の挿入ワード１' AFTER `comment`, 
ADD `insert_word_2nd` VARCHAR(30) NULL DEFAULT '' COMMENT 'ユーザー独自の挿入ワード２' AFTER `insert_word_1st`, 
ADD `insert_word_3rd` VARCHAR(30) NULL DEFAULT '' COMMENT 'ユーザー独自の挿入ワード３' AFTER `insert_word_2nd`;