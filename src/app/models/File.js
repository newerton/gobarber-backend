import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    Model.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      },
    );

    return File;
  }
}

export default File;
