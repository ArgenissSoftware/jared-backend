import Model, { WorkedHoursModel } from "../models/workedHours.model";

/**
 * Worked hours repository
 */
class WorkedHoursRepository {
  model: WorkedHoursModel;

  constructor() {
    this.model = Model;
  }

  /**
   * Get the worked hours of a user in a given month
   * @param {string} userId user's id
   * @param {string} clientId client's id
   * @param {number} month
   * @param {number} year
   */
  async getUserMonthHours(
    userId: string,
    clientId: string,
    month: number,
    year: number
  ) {
    const start = new Date()
    start.setFullYear(year, month, 0);

    const res = await this.model
      .find({
        userId: userId,
        clientId: clientId,
        day: { $lte: start, $gte: new Date(`${year}-${month}-01`) },
      })
      .exec();
    return res;
  }

  /**
   * Set the worked hours
   * @param {string} userId user's id
   * @param {string} clientId client's id
   * @param {*} day date
   * @param {*} hours worked hours
   */
  set(user: string, client: string, day: Date, hours: number) {
    const filter = { user, client, day };

    // upsert
    return this.model.findOneAndUpdate(
      filter,
      { hours },
      {
        new: true,
        upsert: true,
      }
    );
  }
}

export default WorkedHoursRepository;
