import { JSDOM } from 'jsdom';
import getData from '../data';
import { TrackingResult, TrackingStatus } from '../types';
import { cleanupId, checkDigit } from '../tracking-id';

const labelToStatus = (str: string): TrackingStatus => {
  switch (str) {
    case '集荷':
    case '引受':
      return 'picked';
    case '中継':
    case '到着':
    case '通過':
    case '発送':
    case '持ち出し中':
    case '配達希望受付':
    case '転送':
      return 'delivering';
    case 'お届け先にお届け済み':
    case '窓口でお渡し':
      return 'completed';
    case 'ご不在のため持ち戻り':
      return 'absence';
    case '調査中':
      return 'issue';
  }

  if (str.includes('通過') || str.includes('保管') || str.includes('送付')) {
    return 'delivering';
  }
  if (str.includes('返送')) {
    return 'issue';
  }

  return 'unknown';
};

export const getTracking = async (code: string): Promise<TrackingResult> => {
  const base: TrackingResult = {
    id: code,
    type: 'jp-post',
    currentStatus: {
      type: 'unknown',
      label: '(不明)'
    },
    history: []
  };

  const { body } = await getData(
    `https://trackings.post.japanpost.jp/services/srv/search/direct?locale=ja&reqCodeNo1=${code}`
  );

  const {
    window: { document }
  } = new JSDOM(body as string);

  const table = document.querySelector('table[summary="履歴情報"]');
  if (!table) {
    const error = document.querySelector('.txt_l font');

    return {
      ...base,
      error: error.innerHTML
    };
  }
  const [, , ...data] = Array.from(table.querySelectorAll('tr'));
  const history: TrackingResult['history'] = [];
  data.forEach((dom, index) => {
    if (index % 2 === 0) {
      // データ
      const [date, status, description, place, pref] = dom.querySelectorAll(
        'td'
      );
      history.push({
        date: date.innerHTML,
        status: {
          type: labelToStatus(status.innerHTML),
          label: status.innerHTML
        },
        description: description.innerHTML,
        place: `${pref.innerHTML} ${place.innerHTML}`
      });
    } else {
      // 郵便番号
      const postalCode = dom.querySelector('td').innerHTML;
      if (postalCode.trim()) {
        history[history.length - 1].place =
          history[history.length - 1].place + ` 〒${postalCode.innerHTML}`;
      }
    }
  });

  return {
    ...base,
    currentStatus: {
      type: history[history.length - 1].status.type || 'unknown',
      label: history[history.length - 1].status.label || '(不明)'
    },
    history
  };
};

export const validateTrackingID = (code: string): boolean => {
  code = cleanupId(code);

  return (
    !!code &&
    !/([^0-9])/gi.test(code) &&
    [11, 12].includes(code.length) &&
    checkDigit(code)
  );
};
