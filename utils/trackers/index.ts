import { cleanupId } from '../tracking-id';
import { ShippingCompany, TrackingResult } from '../types';

import * as JPPost from './jp-post';
import * as Yamato from './yamato';

export const getTracking = (
  code: string,
  type: ShippingCompany
): Promise<TrackingResult> => {
  code = cleanupId(code);

  switch (type) {
    case 'jp-post':
      return JPPost.getTracking(code);
    case 'yamato':
      return Yamato.getTracking(code);
    default:
      throw new Error('Unknown type.');
  }
};

export const validateTrackingID = (
  code: string,
  type: ShippingCompany
): boolean => {
  code = cleanupId(code);

  switch (type) {
    case 'jp-post':
      return JPPost.validateTrackingID(code);
    case 'yamato':
      return Yamato.validateTrackingID(code);
    default:
      throw new Error('Unknown type.');
  }
};
