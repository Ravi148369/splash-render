module.exports = (sequelize, DataTypes) => {
  const staticContentManagement = sequelize.define(
    'staticContentManagement',
    {
      pageName: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT('long'),
      },
      metaTitle: {
        type: DataTypes.STRING,
      },
      metaDescription: {
        type: DataTypes.TEXT,
      },
    },
    {
      underscored: true,
    },
  );

  return staticContentManagement;
};
