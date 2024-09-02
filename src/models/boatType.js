module.exports = (sequelize, DataTypes) => {
  const boatType = sequelize.define(
    'boatType',
    {
      name: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
    },
    {
      underscored: true,
    },
  );

  boatType.loadScopes = () => {
    boatType.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  boatType.associate = (models) => {
    boatType.hasMany(models.boat, { foreignKey: 'typeId' });
  };
  return boatType;
};
