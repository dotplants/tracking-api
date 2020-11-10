export type ShippingCompany = 'jp-post' | 'yamato';

export type TrackingStatus =
  | 'unknown'
  | 'issue'
  | 'picked'
  | 'delivering'
  | 'absence'
  | 'completed';

export type TrackingResult = {
  id: string;
  type: ShippingCompany;
  currentStatus: {
    type: TrackingStatus;
    label: string;
  };
  error?: string;
  history: Array<{
    date: string;
    status: {
      type: TrackingStatus;
      label: string;
    };
    description: string;
    place: string;
  }>;
};
