module.exports = (sequelize, DataTypes) => {
  const support = sequelize.define(
    'support',
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
    },
    {
      underscored: true,
    },
  );

  return support;
};
