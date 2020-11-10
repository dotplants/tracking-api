import { NowRequest, NowResponse } from '@vercel/node';
import { getTracking, validateTrackingID } from '../utils/trackers';
import { ShippingCompany } from '../utils/types';

const SHIPPING_COMPANIES: Array<ShippingCompany> = ['jp-post', 'yamato'];

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse | void> => {
  const {
    query: { code, type }
  } = req;
  if (type && !SHIPPING_COMPANIES.includes(type as ShippingCompany)) {
    return res.json({
      error: 'Not found the type'
    });
  }
  if (!code) {
    return res.json({
      error: 'The code is required'
    });
  }

  if (!type) {
    for (const type of SHIPPING_COMPANIES) {
      if (!validateTrackingID(code as string, type)) {
        continue;
      }
      try {
        const data = await getTracking(code as string, type);
        if (data.error) {
          continue;
        }

        return res.json(data);
      } catch (e) {
        console.error(e);
        return res.json({
          error: 'Server error'
        });
      }
    }
    res.json({
      error: 'This code is not found'
    });
  } else {
    try {
      if (!validateTrackingID(code as string, type as ShippingCompany)) {
        return res.json({
          error: 'This code is not valid'
        });
      }

      const data = await getTracking(code as string, type as ShippingCompany);
      res.json(data);
    } catch (e) {
      console.error(e);
      return res.json({
        error: 'Server error'
      });
    }
  }
};
