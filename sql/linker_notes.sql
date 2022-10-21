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
-- データベース: `(your_database)`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `linker_notes`
--

DROP TABLE IF EXISTS `linker_notes`;
CREATE TABLE IF NOT EXISTS `linker_notes` (
  `id` int(8) NOT NULL COMMENT 'ノートID',
  `title` varchar(64) NOT NULL COMMENT 'ノートタイトル',
  `url` text COMMENT '関連リンクURL',
  `note` text NOT NULL COMMENT 'ノート本文',
  `publicity` int(2) NOT NULL COMMENT '公開範囲',
  `created_at` datetime NOT NULL COMMENT '登録日',
  `created_user_id` int(8) NOT NULL COMMENT '登録者ID',
  `updated_at` datetime NOT NULL COMMENT '更新日',
  `updated_user_id` int(8) NOT NULL COMMENT '更新者ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- テーブルのデータのダンプ `linker_notes`
--

INSERT INTO `linker_notes` (`id`, `title`, `url`, `note`, `publicity`, `created_at`, `created_user_id`, `updated_at`, `updated_user_id`) VALUES
(1, '人間を超越した何かの存在を、信じますか？', 'https://inujin.hatenablog.com/entry/2013/05/08/005735', '記事のリンクをタイトルに貼りました。そちらをご覧ください。', 1, '2022-09-01 00:00:00', 1, '2022-09-01 00:00:00', 1),
(2, '「脳が疲れている人」7つの症状。当てはまったら要注意', 'https://studyhacker.net/brain-tired-7symptoms', '　現代社会を生きる私たちは、日々膨大な情報にさらされ続け、長時間のデスクワークをし、常に脳を酷使せざるを得ない環境下にいます。そのような状況のなかで当然引き起こされる問題と言えば「脳の疲れ」でしょう。\r\n　今回は、多くのビジネスパーソンに共通の悩みでもある「脳の疲れ」の症状を7つ指摘します。当てはまるものがあったら、脳が疲れている証拠です。最後に対策もご紹介しますので、ぜひ改善を図っていきましょう。\r\n\r\n【症状1】身体の疲れがとれない\r\n　「休み明けなのに身体がだるい」「肩こりがひどい」「眼の奥が重い」など、日々の生活で身体面の疲れを感じることはないでしょうか。東京疲労・睡眠クリニック院長の梶本修身氏は、「すべての疲労は脳の疲れが原因」と警鐘を鳴らします。\r\n　過度な仕事や人間関係の悩みなどを脳はすべてストレスとして受け取り、さまざまな指令を出して対処にあたります。ところが、強いストレスが続くと脳の処理量が一気に増えてしまうことに。結果、本来の働きができなくなり、身体に「疲れた」という警報を送るそうです。身体面の疲労がとれないときは、脳が疲れているのではないかとまずは疑ってみましょう。\r\n\r\n【続きはサイトで】', 1, '2022-09-01 00:00:00', 1, '2022-09-11 00:00:00', 3),
(3, '記憶力を高めるには？日本チャンピオンに、仕事に役立つテクニックを聞いてみた', 'https://hatawarawide.jp/kininaru/220530-1', '　名刺交換をした人たちの顔と名前を覚えられない、仕事のタスクを忘れてしまう——そんなことはないでしょうか。今すぐ記憶力を高めることができたらいいのに……。そう思って訪ねたのは、「世界記憶力グランドマスター」の称号を持つ記憶のスペシャリスト・池田義博さん。\r\n　「世界記憶力グランドマスター」は、「世界記憶力選手権」でランダムに並んだ数字を1時間で1,000桁以上記憶するなど、3つの種目を達成した人だけに与えられる称号です。そんな超能力のようにも思える記憶術を持つ池田さんは「記憶は生まれ持った才能ではなく、テクニック」と言います。そのテクニック、ぜひ教えてください！\r\n\r\n☆記憶力は何歳からでも鍛えられる☆\r\n──最近、やろうと思っていたことをすぐ忘れてしまいます。大人になってからでも記憶力を高めることはできるのでしょうか？\r\n　記憶力は何歳からでも鍛えられるので、安心してください。\r\n【続きはサイトで】', 1, '2022-09-01 00:00:00', 1, '2022-09-21 00:00:00', 4);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `linker_notes`
--
ALTER TABLE `linker_notes`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルのAUTO_INCREMENT
--

--
-- テーブルのAUTO_INCREMENT `linker_notes`
--
ALTER TABLE `linker_notes`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'ノートID', AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
