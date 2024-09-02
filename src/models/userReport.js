module.exports = (sequelize, DataTypes) => {
  const userReport = sequelize.define(
    'userReport',
    {
      toUserId: {
        type: DataTypes.INTEGER,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
      },
      reportedType: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    },
  );

  userReport.associate = (models) => {
    userReport.belongsTo(models.user, {
      foreignKey: 'toUserId',
      as: 'toUser',
    });
    userReport.belongsTo(models.user, {
      foreignKey: 'fromUserId',
      as: 'fromUser',
    });
  };
  return userReport;
};
