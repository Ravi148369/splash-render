module.exports = (sequelize, DataTypes) => {
  const bookingRequestMessage = sequelize.define(
    'bookingRequestMessage',
    {
      bookingRequestId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      fromUserId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );
  bookingRequestMessage.addScope('userDetails', () => ({
    include: [
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
  bookingRequestMessage.associate = (models) => {
    bookingRequestMessage.belongsTo(models.bookingRequest, {
      foreignKey: 'bookingRequestId',
      onDelete: 'cascade',
    });
    bookingRequestMessage.belongsTo(models.user, {
      foreignKey: 'fromUserId',
    });
  };
  return bookingRequestMessage;
};
