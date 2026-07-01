import { isBefore, subHours } from 'date-fns';
import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    Model.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      },
    );

    return Appointment;
  }

  static associate(models) {
    Appointment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Appointment.belongsTo(models.User, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
  }
}

export default Appointment;
