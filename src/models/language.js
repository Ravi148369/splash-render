module.exports = (sequelize, DataTypes) => {
  const language = sequelize.define(
    'language',
    {
      languageName: {
        type: DataTypes.STRING(100),
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
  language.associate = () => {};
  return language;
};
