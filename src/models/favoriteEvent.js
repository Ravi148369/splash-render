module.exports = (sequelize, DataTypes) => {
  const favoriteEvent = sequelize.define(
    'favoriteEvent',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  favoriteEvent.associate = (models) => {
    favoriteEvent.belongsTo(models.event, {
      foreignKey: 'eventId',
      onDelete: 'cascade',
    });
    favoriteEvent.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return favoriteEvent;
};
