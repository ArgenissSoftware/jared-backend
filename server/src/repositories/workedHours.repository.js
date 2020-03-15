const MongooseRepository = require('./repository');
const WorkedHoursModel = require('../models/workedHours.model');

/**
 * Worked hours repository
 */
class WorkedHoursRepository {

  constructor() {
    this.model = WorkedHoursModel;
  }

  /**
   * Get the worked hours of a user in a given month
   * @param {string} userId user's id
   * @param {string} clientId client's id
   * @param {number} month
   * @param {number} year
   */
  async getUserMonthHours(userId, clientId, month, year) {
    const beggin = new Date().setFullYear(year, month, 0);
    const res = await this.model.find({userId: userId, clientId: clientId, day: { $lte: beggin, $gte: new Date(`${year}-${month}-01`) }}).exec();
    return res;
  }

  /**
   * Set the worked hours
   * @param {string} userId user's id
   * @param {string} clientId client's id
   * @param {*} day date
   * @param {*} hours worked hours
   */
  set(userId, clientId, day, hours) {
    const filter = {userId, clientId, day};

    console.log(filter, hours)

    // upsert
    return this.model.findOneAndUpdate(filter, {hours}, {
      new: true,
      upsert: true
    });
  }
}

module.exports = WorkedHoursRepository;