module.exports = (sequelize, DataTypes) => {
  const boatBlockDate = sequelize.define(
    'boatBlockDate',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  boatBlockDate.associate = (models) => {
    boatBlockDate.belongsTo(models.boat, {
      foreignKey: 'boatId',
    });
  };
  return boatBlockDate;
};
