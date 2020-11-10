import got, {
  CancelableRequest,
  OptionsOfBufferResponseBody,
  OptionsOfTextResponseBody,
  Response
} from 'got';
import dotenv from 'dotenv';

dotenv.config();
const contact = process.env.CONTACT_INFO;

const getData = (
  url: string,
  options?: OptionsOfTextResponseBody | OptionsOfBufferResponseBody
): CancelableRequest<Response<unknown>> => {
  if (!contact) {
    throw new Error('Please input your contact information in .env');
  }

  return got(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      'user-agent': `TrackingAPI (${contact})`
    }
  });
};

export default getData;
