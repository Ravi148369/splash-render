import config from '../config';
import utility from '../services/utility';

const defaultAboutUsPageImage = `${config.app.baseUrl}public/default-images/aboutUsPageImage.png`;

module.exports = (sequelize, DataTypes) => {
  const aboutUsPageSetting = sequelize.define(
    'aboutUsPageSetting',
    {
      aboutUsPageImage: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('aboutUsPageImage', tmpStr);
        },
      },
      type: {
        type: DataTypes.ENUM('block1', 'block2', 'block3', 'block4'),
      },
      subTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      aboutUsPageImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('aboutUsPageImage');
          return utility.getImage(str, defaultAboutUsPageImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  return aboutUsPageSetting;
};
