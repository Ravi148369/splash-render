module.exports = (sequelize, DataTypes) => {
  const siteSetting = sequelize.define(
    'siteSetting',
    {
      facebookUrl: {
        type: DataTypes.STRING,
      },
      twitterUrl: {
        type: DataTypes.STRING,
      },
      instagramUrl: {
        type: DataTypes.STRING,
      },
      youTubeUrl: {
        type: DataTypes.STRING,
      },
      pinterestUrl: {
        type: DataTypes.STRING,
      },
      linkedinUrl: {
        type: DataTypes.STRING,
      },
      tikTokUrl: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      mobileNumber: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    },
  );

  return siteSetting;
};
