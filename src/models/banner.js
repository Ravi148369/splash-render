import config from '../config';
import utility from '../services/utility';

const defaultBannerImage = `${config.app.baseUrl}public/default-images/banner.png`;

module.exports = (sequelize, DataTypes) => {
  const banner = sequelize.define(
    'banner',
    {
      type: {
        type: DataTypes.ENUM('top', 'bottom', 'staticBlock'),
      },
      bannerImage: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('bannerImage', tmpStr);
        },
      },
      title: {
        type: DataTypes.STRING,
      },
      subTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT,
      },
      buttonLabel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bannerImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('bannerImage');
          return utility.getImage(str, defaultBannerImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  return banner;
};
