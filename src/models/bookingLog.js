module.exports = (sequelize, DataTypes) => {
  const bookingLog = sequelize.define(
    'bookingLog',
    {
      type: {
        type: DataTypes.ENUM('boat', 'event'),
      },
      bookingDetail: {
        type: DataTypes.TEXT,
      },
      paymentDetail: {
        type: DataTypes.TEXT,
      },
    },
    {
      underscored: true,
    },
  );
  return bookingLog;
};
