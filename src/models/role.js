module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    'role',
    {
      role: {
        type: DataTypes.STRING(50),
      },
    },
    {
      underscored: true,
    },
  );
  return role;
};
