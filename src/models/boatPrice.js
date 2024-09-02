module.exports = (sequelize, DataTypes) => {
  const boatPrice = sequelize.define(
    'boatPrice',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        comment: 'Duration in hours',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(20),
      },
    },
    {
      underscored: true,
    },
  );

  boatPrice.associate = (models) => {
    boatPrice.belongsTo(models.boat, {
      foreignKey: 'boatId',
    });
  };
  return boatPrice;
};
