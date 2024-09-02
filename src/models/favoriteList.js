module.exports = (sequelize, DataTypes) => {
  const favoriteList = sequelize.define(
    'favoriteList',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      underscored: true,
    },
  );

  favoriteList.associate = (models) => {
    favoriteList.hasMany(models.favoriteBoat, {
      foreignKey: 'listId',
      onDelete: 'cascade',
    });
    favoriteList.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return favoriteList;
};
