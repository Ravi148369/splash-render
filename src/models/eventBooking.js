module.exports = (sequelize, DataTypes) => {
  const eventBooking = sequelize.define(
    'eventBooking',
    {
      eventId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      children: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(20),
      },
      identityNumber: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      mobileNumber: {
        type: DataTypes.STRING,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
      },
      countryId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      code: {
        type: DataTypes.STRING,
      },
      paymentStatus: {
        type: DataTypes.STRING,
      },
      perAdultPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      perChildPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      serviceFees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      salesTax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      canceledBy: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      canceledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('deleted', 'pending', 'cancelled', 'completed'),
        defaultValue: 'pending',
      },
    },
    {
      underscored: true,
    },
  );

  eventBooking.addScope('eventBookingList', () => ({
    include: [
      {
        model: sequelize.models.event,
        as: 'event',
        include: [
          {
            model: sequelize.models.boat,
            as: 'boat',
            include: [
              {
                model: sequelize.models.boatImage,
                separate: true,
                required: false,
              },
            ],
            required: false,
          },
          {
            model: sequelize.models.eventImage,
            separate: true,
            required: false,
          },
        ],
        required: false,
      },
      {
        model: sequelize.models.eventBookingPayment,
        attributes: [
          'id',
          'amount',
          'currency',
          'status',
          'transactionId',
          'refundStatus',
          'refundAmount',
          'createdAt',
        ],
        required: false,
      },
    ],
  }));
  eventBooking.addScope('eventBookingDetail', () => ({
    include: [
      {
        model: sequelize.models.event,
        as: 'event',
        include: [
          {
            model: sequelize.models.eventImage,
            separate: true,
            required: false,
          },
        ],
        required: false,
      },
      {
        model: sequelize.models.eventBookingPayment,
        attributes: [
          'id',
          'amount',
          'currency',
          'status',
        ],
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

  eventBooking.associate = (models) => {
    eventBooking.belongsTo(models.event, {
      foreignKey: 'eventId',
      as: 'event',
    });
    eventBooking.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
    eventBooking.belongsTo(models.country, {
      foreignKey: 'countryId',
    });
    eventBooking.hasOne(models.eventBookingPayment, {
      foreignKey: 'bookingId',
    });
  };
  return eventBooking;
};
