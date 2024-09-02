const BOOKING_STATUS = {
  PENDING: 'pending',
  CANCELED: 'cancelled',
  COMPLETED: 'completed',
  DELETED: 'deleted',
};

const EVENT_BOOKING_STATUS = {
  PENDING: 'pending',
  CANCELED: 'cancelled',
  COMPLETED: 'completed',
  DELETED: 'deleted',
};

const BOAT_BOOKING_PAYMENT_STATUS = {
  PENDING: 'pending',
  CANCELED: 'cancelled',
  COMPLETED: 'completed',
  DELETED: 'deleted',
  REQUIRES_PAYMENT: 'requires_payment_method',
};

const EVENT_BOOKING_PAYMENT_STATUS = {
  PENDING: 'pending',
  CANCELED: 'cancelled',
  COMPLETED: 'completed',
  DELETED: 'deleted',
};

const GET_BOOKING_TYPE = {
  UPCOMING: 'upcoming',
  PREVIOUS: 'previous',
};

const STRIPE_PAYMENT_STATUS = {
  SUCCEEDED: 'succeeded',
  TRANSFERRED: 'transferred',
};

const BOAT_BOOKING_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  CANCELED: 'cancelled',
};

const BOOKING_LOG_TYPE = {
  BOAT: 'boat',
  EVENT: 'event',
};

export default {
  BOOKING_STATUS,
  BOAT_BOOKING_PAYMENT_STATUS,
  STRIPE_PAYMENT_STATUS,
  EVENT_BOOKING_STATUS,
  EVENT_BOOKING_PAYMENT_STATUS,
  GET_BOOKING_TYPE,
  BOAT_BOOKING_REQUEST_STATUS,
  BOOKING_LOG_TYPE,
};
