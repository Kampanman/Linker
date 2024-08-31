-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- サーバのバージョン： 5.7.32-log
-- PHP のバージョン: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `empower-util_mydb`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `linker_videos`
--

DROP TABLE IF EXISTS `linker_videos`;
CREATE TABLE IF NOT EXISTS `linker_videos` (
  `id` int(8) NOT NULL COMMENT '動画ID',
  `title` varchar(64) NOT NULL COMMENT '動画タイトル',
  `url` text NOT NULL COMMENT '動画URL',
  `publicity` int(2) NOT NULL COMMENT '公開範囲',
  `created_at` datetime NOT NULL COMMENT '登録日',
  `created_user_id` int(8) NOT NULL COMMENT '登録者ID',
  `updated_at` datetime NOT NULL COMMENT '更新日',
  `updated_user_id` int(8) NOT NULL COMMENT '更新者ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- テーブルのデータのダンプ `linker_videos`
--

INSERT INTO `linker_videos` (`id`, `title`, `url`, `publicity`, `created_at`, `created_user_id`, `updated_at`, `updated_user_id`) VALUES
(1, '歌詞を付けた「レッツゴー！陰陽師」PV', 'https://www.youtube.com/watch?v=QByawy3fUqI', 1, '2022-09-01 00:00:00', 1, '2022-09-01 00:00:00', 1),
(2, 'ピクミン 愛の歌', 'https://www.youtube.com/watch?v=eHcldNM9fAI', 1, '2022-09-01 00:00:00', 1, '2022-09-11 00:00:00', 2),
(3, 'たま さよなら人類', 'https://www.youtube.com/watch?v=ZTBHdIvCVOU', 1, '2022-09-01 00:00:00', 1, '2022-09-11 00:00:00', 3);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `linker_videos`
--
ALTER TABLE `linker_videos`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルのAUTO_INCREMENT
--

--
-- テーブルのAUTO_INCREMENT `linker_videos`
--
ALTER TABLE `linker_videos`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT COMMENT '動画ID', AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
