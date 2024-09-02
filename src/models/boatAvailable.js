module.exports = (sequelize, DataTypes) => {
  const boatAvailable = sequelize.define(
    'boatAvailable',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  boatAvailable.associate = (models) => {
    boatAvailable.belongsTo(models.boat, {
      foreignKey: 'boatId',
    });
  };
  return boatAvailable;
};
