import MongooseRepository from "./repository";
import Model, { ClientDocument, ClientModel } from "../models/client.model";

/**
 * Clients repository
 */
class ClientsRepository extends MongooseRepository<
  ClientDocument,
  ClientModel
> {
  /**
   * Constructor
   */
  constructor() {
    super(Model);
    this.fieldsSearch = ["name", "email", "contactName"];
  }

  /**
   * Find client by name.
   */
  findOneByName(name: string) {
    return this.model.findOne({ name: name }).lean().exec();
  }

  /**
   * Find an client with his employees.
   * @param {string} id - Object Id
   */
  findOne(id: string) {
    return this.model
      .findOne({
        _id: id,
      })
      .populate("employees")
      .lean()
      .exec();
  }
}

export default ClientsRepository;
