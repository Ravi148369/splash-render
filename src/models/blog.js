import config from '../config';
import utility from '../services/utility';

const defaultBlogImage = `${config.app.baseUrl}public/default-images/blog.png`;

module.exports = (sequelize, DataTypes) => {
  const blog = sequelize.define(
    'blog',
    {
      blogImage: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('blogImage', tmpStr);
        },
      },
      title: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('active', 'deleted'),
        defaultValue: 'active',
      },
      blogImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('blogImage');
          return utility.getImage(str, defaultBlogImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  return blog;
};
