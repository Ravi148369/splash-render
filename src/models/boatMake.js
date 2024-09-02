module.exports = (sequelize, DataTypes) => {
  const boatMake = sequelize.define(
    'boatMake',
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

  boatMake.loadScopes = () => {
    boatMake.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  boatMake.associate = (models) => {
    boatMake.hasMany(models.boatModel, {
      foreignKey: 'makeId',
      onDelete: 'cascade',
    });
  };

  return boatMake;
};
