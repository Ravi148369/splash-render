module.exports = (sequelize, DataTypes) => {
  const bookingRequest = sequelize.define(
    'bookingRequest',
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
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
    },
    {
      underscored: true,
    },
  );
  bookingRequest.addScope('boatDetails', () => ({
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
    ],
  }));
  bookingRequest.associate = (models) => {
    bookingRequest.belongsTo(models.boat, {
      foreignKey: 'boatId',
      as: 'boat',
    });
    bookingRequest.belongsTo(models.user, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    bookingRequest.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return bookingRequest;
};
