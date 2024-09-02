module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define(
    'booking',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.STRING,
      },
      endTime: {
        type: DataTypes.STRING,
      },
      timezone: {
        type: DataTypes.STRING(120),
      },
      code: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(20),
      },
      paymentStatus: {
        type: DataTypes.STRING,
      },
      identityNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      countryId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      bookingRequestId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
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
      cancellationPolicy: {
        type: DataTypes.ENUM('flexible', 'moderate', 'strict', 'super strict'),
        defaultValue: 'flexible',
      },
      boatPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      renterServiceFees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      ownerServiceFees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      salesTax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
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

  booking.addScope('bookingList', () => ({
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
          {
            model: sequelize.models.country,
            attributes: [
              'id',
              'name',
              'countryCode',
              'iso3',
            ],
            required: false,
          },
          {
            model: sequelize.models.state,
            attributes: [
              'id',
              'name',
              'stateCode',
            ],
            required: false,
          },
        ],
        required: false,
      },
      {
        model: sequelize.models.user,
        as: 'owner',
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
      {
        model: sequelize.models.bookingPayment,
        attributes: [
          'id',
          'transactionId',
          'amount',
          'currency',
          'status',
          'refundStatus',
          'refundAmount',
          'transferId',
          'transferTransactionId',
          'destinationId',
          'transferredAmount',
          'transferStatus',
          'createdAt',
        ],
        required: false,
      },
    ],
  }));
  booking.addScope('reservationsList', () => ({
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
          {
            model: sequelize.models.country,
            attributes: [
              'id',
              'name',
              'countryCode',
              'iso3',
            ],
            required: false,
          },
          {
            model: sequelize.models.state,
            attributes: [
              'id',
              'name',
              'stateCode',
            ],
            required: false,
          },
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
  booking.addScope('bookingDetail', () => ({
    include: [
      {
        model: sequelize.models.boat,
        as: 'boat',
        include: [
          {
            model: sequelize.models.boatImage,
            required: false,
          },
          {
            model: sequelize.models.boatType,
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: sequelize.models.state,
            required: false,
          },
          {
            model: sequelize.models.country,
            required: false,
          },
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
      {
        model: sequelize.models.user,
        as: 'owner',
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
      {
        model: sequelize.models.bookingPayment,
        attributes: [
          'id',
          'transactionId',
          'amount',
          'currency',
          'status',
          'refundStatus',
          'refundAmount',
          'transferId',
          'transferTransactionId',
          'destinationId',
          'transferredAmount',
          'transferStatus',
          'createdAt',
        ],
        required: false,
      },
    ],
  }));

  booking.associate = (models) => {
    booking.belongsTo(models.boat, {
      foreignKey: 'boatId',
      as: 'boat',
    });
    booking.belongsTo(models.user, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    booking.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
    booking.hasOne(models.bookingPayment, {
      foreignKey: 'bookingId',
    });
  };
  return booking;
};
