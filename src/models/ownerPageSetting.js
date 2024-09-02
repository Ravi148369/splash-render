import config from '../config';
import utility from '../services/utility';

const defaultOwnerPageImage = `${config.app.baseUrl}public/default-images/ownerPageImage.png`;

module.exports = (sequelize, DataTypes) => {
  const ownerPageSetting = sequelize.define(
    'ownerPageSetting',
    {
      ownerPageImage: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('ownerPageImage', tmpStr);
        },
      },
      type: {
        type: DataTypes.ENUM(
          'topBanner',
          'list',
          'inventory',
          'review',
          'rental',
          'bottomBanner',
        ),
      },
      heading: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
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
      ownerPageImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('ownerPageImage');
          return utility.getImage(str, defaultOwnerPageImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  return ownerPageSetting;
};
