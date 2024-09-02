module.exports = (sequelize, DataTypes) => {
  const footerBlock = sequelize.define(
    'footerBlock',
    {
      title1: {
        type: DataTypes.STRING,
      },
      content1: {
        type: DataTypes.TEXT,
      },
      title2: {
        type: DataTypes.STRING,
      },
      content2: {
        type: DataTypes.TEXT,
      },
      title3: {
        type: DataTypes.STRING,
      },
      content3: {
        type: DataTypes.TEXT,
      },
    },
    {
      underscored: true,
    },
  );

  return footerBlock;
};
