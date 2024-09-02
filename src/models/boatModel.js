module.exports = (sequelize, DataTypes) => {
  const boatModel = sequelize.define(
    'boatModel',
    {
      name: {
        type: DataTypes.STRING,
      },
      makeId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
    },
    {
      underscored: true,
    },
  );

  boatModel.loadScopes = () => {
    boatModel.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  boatModel.associate = (models) => {
    boatModel.belongsTo(models.boatMake, {
      foreignKey: 'makeId',
      onDelete: 'cascade',
    });
  };

  return boatModel;
};
