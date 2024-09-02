module.exports = (sequelize, DataTypes) => {
  const userRole = sequelize.define(
    'userRole',
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    },
  );

  userRole.associate = (models) => {
    userRole.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    userRole.belongsTo(models.role, {
      foreignKey: 'roleId',
      onDelete: 'cascade',
    });
  };
  return userRole;
};
