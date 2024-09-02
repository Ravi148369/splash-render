module.exports = (sequelize, DataTypes) => {
  const media = sequelize.define(
    'media',
    {
      name: {
        type: DataTypes.STRING(100),
      },
      basePath: {
        type: DataTypes.STRING,
      },
      baseUrl: {
        type: DataTypes.STRING,
      },
      mediaType: {
        type: DataTypes.ENUM('image', 'file', 'audio', 'video'),
      },
      mediaFor: {
        type: DataTypes.ENUM(
          'user',
          'banner',
          'admin',
          'staticBlock',
          'boat',
          'popularLocation',
          'event',
          'blog',
          'userDocument',
          'ownerPage',
          'aboutUsPage',
        ),
      },
      fileType: {
        type: DataTypes.VIRTUAL,
        get() {
          const file = this.get('basePath');
          if (file) {
            const fileArray = file.split('.');
            const ext = fileArray.pop();
            return ext;
          }
          return null;
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'used', 'deleted'),
        defaultValue: 'pending',
      },
    },
    {
      underscored: true,
    },
  );
  media.associate = () => {
    // associations can be defined here
  };
  return media;
};
