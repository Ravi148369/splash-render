module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define(
    'review',
    {
      boatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookingId: {
        type: DataTypes.INTEGER,
      },
      ownerId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      underscored: true,
    },
  );
  review.addScope('boatDetail', () => ({
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
    ],
  }));
  review.associate = (models) => {
    review.belongsTo(models.boat, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    review.belongsTo(models.user, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    review.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return review;
};
