module.exports = (sequelize, DataTypes) => {
  const boat = sequelize.define(
    'boat',
    {
      name: {
        type: DataTypes.STRING(256),
      },
      ownerId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      typeId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      length: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      makeId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      modelId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      numberOfPassenger: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      yearId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      countryId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      stateId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
      },
      streetAddress: {
        type: DataTypes.TEXT,
      },
      zipCode: {
        type: DataTypes.STRING(20),
      },
      latitude: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      isRecommended: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      isBooking: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending',
      },
      liveStatus: {
        type: DataTypes.ENUM('listed', 'unlisted'),
        defaultValue: 'unlisted',
      },
      cancellationPolicy: {
        type: DataTypes.ENUM('flexible', 'moderate', 'strict', 'super strict'),
        defaultValue: 'flexible',
      },
    },
    {
      underscored: true,
    },
  );

  boat.addScope('boatDetail', () => ({
    include: [
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
          'createdAt',
        ],
        required: true,
      },
      {
        model: sequelize.models.boatType,
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: sequelize.models.boatMake,
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: sequelize.models.boatModel,
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: sequelize.models.boatYear,
        attributes: ['id', 'year'],
        required: false,
      },
      {
        model: sequelize.models.boatFeatureList,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: false,
        duplicating: false,
        include: [
          {
            model: sequelize.models.boatFeature,
            attributes: ['name'],
          },
        ],
      },
      {
        model: sequelize.models.boatImage,
        required: false,
        duplicating: false,
      },
      {
        model: sequelize.models.boatRuleList,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: false,
        duplicating: false,
        include: [
          {
            model: sequelize.models.boatRule,
            attributes: ['name'],
          },
        ],
      },
      {
        model: sequelize.models.boatBlockDate,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: false,
        duplicating: false,
      },
      {
        model: sequelize.models.boatPrice,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: false,
        duplicating: false,
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
  }));

  boat.addScope('boatList', () => ({
    include: [
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
          'createdAt',
        ],
        required: true,
      },
      {
        model: sequelize.models.boatType,
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: sequelize.models.boatMake,
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: sequelize.models.boatModel,
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: sequelize.models.boatYear,
        attributes: ['id', 'year'],
        required: false,
      },
      {
        model: sequelize.models.boatImage,
        required: false,
        limit: 10,
        duplicating: false,
      },
    ],
  }));

  boat.associate = (models) => {
    boat.belongsTo(models.user, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    boat.belongsTo(models.boatType, {
      foreignKey: 'typeId',
    });
    boat.belongsTo(models.boatMake, {
      foreignKey: 'makeId',
    });
    boat.belongsTo(models.boatModel, {
      foreignKey: 'modelId',
    });
    boat.belongsTo(models.boatYear, {
      foreignKey: 'yearId',
    });
    boat.belongsTo(models.state, {
      foreignKey: 'stateId',
    });
    boat.belongsTo(models.country, {
      foreignKey: 'countryId',
    });
    boat.hasMany(models.boatFeatureList, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.boatImage, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.boatRuleList, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.review, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.boatAvailable, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.boatBlockDate, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.boatPrice, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    boat.hasMany(models.favoriteBoat, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
  };
  return boat;
};
