module.exports = (sequelize, DataTypes) => {
  const boatFeatureList = sequelize.define(
    'boatFeatureList',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      featureId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  boatFeatureList.associate = (models) => {
    boatFeatureList.belongsTo(models.boat, {
      foreignKey: 'boatId',
      as: 'boat',
    });
    boatFeatureList.belongsTo(models.boatFeature, {
      foreignKey: 'featureId',
    });
  };
  return boatFeatureList;
};
