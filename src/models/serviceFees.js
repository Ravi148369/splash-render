module.exports = (sequelize, DataTypes) => {
  const serviceFees = sequelize.define(
    'serviceFees',
    {
      renterFees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      ownerFees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      feesType: {
        type: DataTypes.ENUM('percentage'),
        defaultValue: 'percentage',
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  return serviceFees;
};
