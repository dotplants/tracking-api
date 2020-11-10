import { JSDOM } from 'jsdom';
import Iconv from 'iconv-lite';
import getData from '../data';
import { TrackingResult, TrackingStatus } from '../types';

const labelToStatus = (str: string): TrackingStatus => {
  switch (str) {
    case '荷物受付':
      return 'picked';
    case '発送':
    case '作業店通過':
      return 'delivering';
    case '配達完了':
      return 'completed';
    default:
      return 'unknown';
  }
};

export const getTracking = async (code: string): Promise<TrackingResult> => {
  const base: TrackingResult = {
    id: code,
    type: 'yamato',
    currentStatus: {
      type: 'unknown',
      label: '(不明)'
    },
    history: []
  };

  const { body } = await getData(
    'http://toi.kuronekoyamato.co.jp/cgi-bin/tneko',
    {
      method: 'POST',
      body: `number00=1&number01=${code}`,
      responseType: 'buffer',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  const utf8body = Iconv.decode(body as Buffer, 'SHIFT_JIS');

  const {
    window: { document }
  } = new JSDOM(utf8body);

  const table = document.querySelector('.meisai');

  const currentTitle = document.querySelector('.font14');
  const currentMessage = document
    .querySelectorAll('.saisin tr')[2]
    .querySelector('td');

  if (!table) {
    return {
      ...base,
      error: `${currentTitle.innerHTML}: ${currentMessage.innerHTML}`
    };
  }

  const [, ...data] = Array.from(table.querySelectorAll('tr'));
  const history: TrackingResult['history'] = data.map(dom => {
    const [, status, date, time, place, placeCode] = dom.querySelectorAll('td');

    const placeDom = place.querySelector('a');
    const placeText = placeDom ? placeDom.innerHTML : place.innerHTML;

    return {
      date: `${date.innerHTML} ${time.innerHTML}`,
      status: {
        type: labelToStatus(status.innerHTML),
        label: status.innerHTML
      },
      description: '',
      place: `${placeText} (コード: ${placeCode.innerHTML})`
    };
  });

  return {
    ...base,
    currentStatus: {
      type: history[history.length - 1].status.type || 'unknown',
      label: `${currentTitle.innerHTML}: ${currentMessage.innerHTML}`
    },
    history
  };
};

export const validateTrackingID = (code: string): boolean => {
  // WIP
  return !!code;
};
