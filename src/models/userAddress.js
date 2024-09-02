module.exports = (sequelize, DataTypes) => {
  const userAddress = sequelize.define(
    'userAddress',
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      street: {
        type: DataTypes.STRING,
      },
      countryId: {
        type: DataTypes.INTEGER,
      },
      stateId: {
        type: DataTypes.INTEGER,
      },
      city: {
        type: DataTypes.STRING,
      },
      zipcode: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 6),
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 6),
      },
    },
    {
      underscored: true,
    },
  );
  userAddress.associate = (models) => {
    userAddress.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    userAddress.belongsTo(models.state, {
      foreignKey: 'stateId',
      onDelete: 'cascade',
    });
    userAddress.belongsTo(models.country, {
      foreignKey: 'countryId',
      onDelete: 'cascade',
    });
  };
  return userAddress;
};
