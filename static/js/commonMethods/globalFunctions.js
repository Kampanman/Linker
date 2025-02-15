// 半角英字でランダムに文字列を生成する
export function useGeneratedChars() {
  let chars = '';
  const base = ['a','i','u','e','o','b','c','d','f','g','h','k','l','m','n','p','r','s','t','y','z'];
  const bo_in = ['a', 'i', 'u', 'e', 'o'];
  
  for (let i = 0; i < 3; i++) {
    let base_rand = Math.floor(Math.random() * base.length);
    let boIn_rand = Math.floor(Math.random() * 5);
    chars += base[base_rand];
    chars += bo_in[boIn_rand];
  }

  return chars;
};

// ランダムに半角数字4桁を生成する
export function useGeneratedQuatNums() {
  let nums = '';

  for (let i = 0; i < 4; i++) {
    let rand_num = String(Math.floor(Math.random() * 10));
    nums += rand_num;
  }

  return nums;
};

// textarea内の選択範囲を指定する
export function useSetSelection(area) {
  let textarea = area;
  let pos_start = textarea.selectionStart;
  let pos_end = textarea.selectionEnd;
  let val = textarea.value;
  let selectionObject = {
    textarea: textarea,
    range: val.slice(pos_start, pos_end),
    beforeNode: val.slice(0, pos_start),
    afterNode: val.slice(pos_end)
  };

  return selectionObject;
}

// 引数に指定された文字列に応じてpublicityの数値を返す
export function useConvertPublicity(pub_str) {
  let publicity = 1;
  if(pub_str=="非公開") publicity = 0;
  if(pub_str=="講師にのみ公開") publicity = 2;

  return publicity;
};

// setNowDate()で返されたオブジェクトを引数に指定して、yyyyMMdd_hhmmssの値を返す
export function useGetSimpleDateString(pr) {
  const untilDay = `${pr.year_str}${pr.month_strWithZero}${pr.day_strWithZero}`;
  const afterDay = `${pr.hour_strWithZero}${pr.minute_strWithZero}${pr.second_strWithZero}`;

  return `${untilDay}_${afterDay}`;
};

// setNowDate()で返されたオブジェクトを引数に指定して、日本語形式で日時の値を返す
export function useGetJapDateString(pr) {
  return `${pr.year_str}年${pr.month_str}月${pr.day_str}日 (${pr.dayOfWeekStr}) ${pr.hour_str}時${pr.minute_str}分`;
};

// 操作日の日時を取得してオブジェクト型で返す
export function useSetNowDate() {
  const date = new Date();
  const setMonth = 1 + date.getMonth();
  const dayOfWeek = date.getDay(); // 曜日(数値)
  const dateParam = {
    year_str: date.getFullYear(),
    month_str: setMonth, //月だけ+1する
    month_strWithZero: setMonth.toString().padStart(2,'0'),
    day_str: date.getDate(),
    day_strWithZero: date.getDate().toString().padStart(2,'0'),
    hour_str: date.getHours(),
    hour_strWithZero: date.getHours().toString().padStart(2,'0'),
    minute_str: date.getMinutes(),
    minute_strWithZero: date.getMinutes().toString().padStart(2,'0'),
    second_strWithZero: date.getSeconds().toString().padStart(2,'0'),
    dayOfWeekStr: ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek] // 曜日
  };

  return dateParam;
};

// 句読点で分割したテキストのパーツを格納した配列を返す
export function useSplitTextByPunctuatedParts(text) {
  // 句読点で分割し、句読点を末尾に付ける
  const punctuatedParts = text.split(/(?<=[、。？\?])/);

  // 最終的なテキスト配列
  let rowTextArray = [];

  // 各パーツを処理
  punctuatedParts.forEach(part => {
      // 20文字を超える場合はさらに分割
      while (part.length > 20) {
          // 20文字で分割し、rowTextArrayに追加
          rowTextArray.push(part.slice(0, 20));
          part = part.slice(20);
      }
      // 残った部分があれば追加
      if (part.length > 0) {
          rowTextArray.push(part);
      }
  });

  return rowTextArray;
};

// allOff(), allOn()で使える、this.allToggle切替用の値を返す関数
export function useChangeForAll(target, num) {
  let lines = target;

  lines.forEach(e => {
    e.style.opacity = num;
    if (num == 1) {
      e.classList.add('visible');
      e.classList.remove('invisible');
    } else {
      e.classList.add('invisible');
      e.classList.remove('visible');
    }
  });
  
  return num;
};

// シンプルな文字で秘匿する選択範囲のテキストを返す関数
export function useGetSecretPhrase(selection) {
  let textarea = selection.textarea;
  let range = selection.range;
  let insertUnder = '';

  // 選択範囲の文字列数分、秘匿用に「_」を配置する
  for (let i = 0; i < range.length; i++) insertUnder += '_';
  let beforeNode = selection.beforeNode;
  let afterNode = selection.afterNode;
  if (range.length > 0) textarea.value = beforeNode + '【' + insertUnder + '】' + afterNode;

  return textarea.value;
}

// ランダムな文字で秘匿する選択範囲のテキストを返す関数
export function useGetRandSecretPhrase(selection) {
  let textarea = selection.textarea;
  let range = selection.range;
  let beforeNode = selection.beforeNode;
  let afterNode = selection.afterNode;
  
  // 選択範囲を秘匿する文字列がランダムで選択される
  const phraseArray = ['【＿見せられません＿】', '【＿秘匿事項です＿】', '【＿勘弁して下さい＿】', '【＿ぐぶっッ！＿】', '【＿ゴバァッ！＿】'];
  let insertNode = phraseArray[Math.floor(Math.random() * phraseArray.length)];
  if (range.length > 0) textarea.value = beforeNode + insertNode + afterNode;
  
  return textarea.value;
}