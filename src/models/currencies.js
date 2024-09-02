module.exports = (sequelize, DataTypes) => {
  const currency = sequelize.define(
    'currency',
    {
      currencyName: {
        type: DataTypes.STRING(100),
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active',
      },
    },
    {
      underscored: true,
    },
  );
  currency.associate = () => {};
  return currency;
};
