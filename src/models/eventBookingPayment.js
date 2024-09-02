module.exports = (sequelize, DataTypes) => {
  const eventBookingPayment = sequelize.define(
    'eventBookingPayment',
    {
      bookingId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING(256),
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(20),
      },
      paymentResponse: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING(256),
      },
      refundStatus: {
        type: DataTypes.STRING(120),
      },
      refundResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refundAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      underscored: true,
    },
  );
  eventBookingPayment.addScope('transaction', () => ({
    include: [
      {
        model: sequelize.models.event,
        as: 'event',
        attributes: ['id', 'name'],
        include: [
          {
            model: sequelize.models.eventImage,
            separate: true,
            required: false,
          },
          {
            model: sequelize.models.boat,
            as: 'boat',
            attributes: ['id', 'name'],
            required: false,
          },
        ],
        required: false,
      },
      {
        model: sequelize.models.eventBooking,
        attributes: ['id', 'adults', 'children'],
        required: false,
      },
      {
        model: sequelize.models.user,
        as: 'user',
        attributes: [
          'id',
          'profileImageUrl',
          'profileImage',
          'firstName',
          'lastName',
          'email',
          'countryCode',
          'phoneNumber',
          'dateOfBirth',
          'whereYouLive',
          'describeYourself',
        ],
        required: true,
      },
    ],
  }));
  eventBookingPayment.associate = (models) => {
    eventBookingPayment.belongsTo(models.eventBooking, {
      foreignKey: 'bookingId',
      onDelete: 'cascade',
    });
    eventBookingPayment.belongsTo(models.event, {
      foreignKey: 'eventId',
      as: 'event',
    });
    eventBookingPayment.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return eventBookingPayment;
};
