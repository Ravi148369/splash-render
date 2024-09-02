module.exports = (sequelize, DataTypes) => {
  const bookingPayment = sequelize.define(
    'bookingPayment',
    {
      bookingId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
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
        defaultValue: '',
      },
      refundResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refundAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      transferId: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      transferTransactionId: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      destinationId: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      transferStatus: {
        type: DataTypes.STRING(120),
        defaultValue: '',
      },
      transferResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      transferredAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      underscored: true,
    },
  );
  bookingPayment.addScope('transactionList', () => ({
    include: [
      {
        model: sequelize.models.boat,
        as: 'boat',
        required: false,
      },
      {
        model: sequelize.models.booking,
        required: true,
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
  bookingPayment.addScope('transaction', () => ({
    include: [
      {
        model: sequelize.models.boat,
        as: 'boat',
        attributes: ['id', 'name'],
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
        model: sequelize.models.booking,
        attributes: ['id', 'bookingDate'],
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
  bookingPayment.associate = (models) => {
    bookingPayment.belongsTo(models.booking, {
      foreignKey: 'bookingId',
      onDelete: 'cascade',
    });
    bookingPayment.belongsTo(models.boat, {
      foreignKey: 'boatId',
      as: 'boat',
    });
    bookingPayment.belongsTo(models.user, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    bookingPayment.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return bookingPayment;
};
