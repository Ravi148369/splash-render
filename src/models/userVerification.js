module.exports = (sequelize, DataTypes) => {
  const userVerification = sequelize.define(
    'userVerification',
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      isEmailVerified: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      isFacebookVerified: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      isGoogleVerified: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
    },
    {
      underscored: true,
    },
  );

  userVerification.associate = (models) => {
    userVerification.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };
  return userVerification;
};
