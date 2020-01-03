const MongooseRepository = require('./repository');
const WorkedHoursModel = require('../models/workedHours.model');

/**
 * Worked hours repository
 */
class WorkedHoursRepository extends MongooseRepository {
  constructor() {
    super(WorkedHoursModel);
  }

  /**
   * get all records of a user
   */
  async findMonthWorkedHours(userId, clientId, month, year) {
    const res = await this.model.find({user: userId, client :clientId,
       day: { $lt: new Date(), $gt: new Date(year+','+month) }}).exec();
    const count = await this.model.countDocuments(query);
    return {list: res, count: count};
  }

  addWorkedHours(workedHours) {
    return this.model.create(workedHours);
  }

  updateWorkedHours(workedHours) {
    return this.model.findByIdAndUpdate(workedHours._id, entity, {
      new: true,
      passRawResult: true, 
      lean: true
    }).exec();
  }

}

module.exports = WorkedHoursRepository;