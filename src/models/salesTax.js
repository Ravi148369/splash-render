module.exports = (sequelize, DataTypes) => {
  const salesTax = sequelize.define(
    "salesTax",
    {
      zipCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      salesTax: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      taxType: {
        type: DataTypes.ENUM("percentage"),
        defaultValue: "percentage",
      },
    },
    {
      underscored: true,
    }
  );

  return salesTax;
};
