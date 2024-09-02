module.exports = (sequelize, DataTypes) => {
  const userNotification = sequelize.define(
    'userNotification',
    {
      toUserId: {
        type: DataTypes.INTEGER,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
      },
      notificationsType: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.STRING,
      },
      customFields: {
        type: DataTypes.TEXT,
        get() {
          const data = this.getDataValue('customFields');
          return data ? JSON.parse(data) : null;
        },
      },
      readStatus: {
        type: DataTypes.ENUM('unread', 'read'),
        defaultValue: 'unread',
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
  userNotification.addScope('notificationData', () => ({
    include: [
      {
        model: sequelize.models.user,
        as: 'fromUser',
        attributes: [
          'id',
          'profileImageUrl',
          'profileImage',
          'firstName',
          'lastName',
          'email',
          'countryCode',
          'phoneNumber',
          'dateOfBirth',
          'whereYouLive',
          'describeYourself',
        ],
        required: true,
      },
    ],
  }));
  userNotification.associate = (model) => {
    userNotification.belongsTo(model.user, {
      foreignKey: 'toUserId',
      onDelete: 'cascade',
    });
    userNotification.belongsTo(model.user, {
      foreignKey: 'fromUserId',
      as: 'fromUser',
      onDelete: 'cascade',
    });
  };
  return userNotification;
};
