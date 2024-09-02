module.exports = (sequelize, DataTypes) => {
  const favoriteBoat = sequelize.define(
    'favoriteBoat',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      boatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  favoriteBoat.associate = (models) => {
    favoriteBoat.belongsTo(models.favoriteList, {
      foreignKey: 'listId',
      onDelete: 'cascade',
    });
    favoriteBoat.belongsTo(models.boat, {
      foreignKey: 'boatId',
      onDelete: 'cascade',
    });
    favoriteBoat.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return favoriteBoat;
};
