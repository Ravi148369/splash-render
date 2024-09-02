module.exports = (sequelize, DataTypes) => {
  const userDevice = sequelize.define(
    'userDevice',
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.TEXT,
      },
      deviceId: {
        type: DataTypes.STRING,
      },
      deviceType: {
        type: DataTypes.ENUM('Android', 'Ios', 'Web'),
      },
      firebaseToken: {
        type: DataTypes.STRING,
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

  userDevice.associate = (models) => {
    userDevice.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };
  return userDevice;
};
