module.exports = (sequelize, DataTypes) => {
  const boatFeature = sequelize.define(
    'boatFeature',
    {
      name: {
        type: DataTypes.STRING,
      },
      isDefault: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
    },
    {
      underscored: true,
    },
  );

  boatFeature.loadScopes = () => {
    boatFeature.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  return boatFeature;
};
