import { FilterQuery, UpdateQuery } from "mongoose";
import { BaseDocument } from "../models/base.document";
import { BaseModel } from "../models/base.model";

/**
 * Repository implementation for Mongoose
 */
class Repository<D extends BaseDocument, M extends BaseModel<D>> {
  model: M;
  fieldsSearch: Array<string>;
  queryFields: string;

  /**
   * Constructor
   */
  constructor(model: any) {
    if (!model) {
      throw new Error("Mongoose model type cannot be null.");
    }
    this.model = model;
    this.queryFields = "-";
  }

  /**
   * Finds all instances in the model, with pagination.
   * @param {string} fields - specific fields to be included/excluded
   * @param {object} query - query
   * @param {object} options - options to append to Mongoose's query
   */
  async findAll(fields: string, query: FilterQuery<D>, options: any) {
    const res = await this.model.find(query, fields, options).exec();
    const count = await this.model.countDocuments(query);
    return { list: res, count: count };
  }

  /**
   * Finds all instances in the model paginated
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   * @param {string} search - string to search
   * @param {object} query - string to search
   */
  async findAllPaginated(
    pageNum: number,
    pageSize: number,
    search: string,
    query = { active: true } as FilterQuery<D>
  ) {
    const options = {};
    this.paginationQueryOptions(pageNum, pageSize, options);
    if (search) this.searchQueryOptions(search, this.fieldsSearch, query);
    return this.findAll(this.queryFields, query, options);
  }

  /**
   * Find an object.
   * @param {string} id - Object Id
   */
  findOne(id: string) {
    return this.model
      .findById(
        id,
        this.queryFields
      )
      .lean()
      .exec();
  }

  /**
   * Create an entity.
   * @param {object} entity - Object to create.
   */
  add(entity: D) {
    return this.model.create(entity);
  }

  /**
   * Partially update an object.
   * @param {string} id - Object Id
   * @param {object} obj - Key/Value pairs to update
   */
  patch(id: any, obj: UpdateQuery<D>) {
    return this.model.findOneAndUpdate(
      {
        _id: id,
      },
      obj,
      {
        new: true,
        lean: true,
      }
    );
  }

  /**
   * Update an entity.
   * @param {object} entity - Object to update.
   */
  update(entity: D) {
    return this.model
      .findByIdAndUpdate(entity._id, entity, {
        new: true,
        // passRawResult: true,
        lean: true,
      })
      .exec();
  }

  /**
   * Delete an entity.
   * @param {string} id - Entity Id
   */
  remove(id: string) {
    return this.model.findByIdAndRemove(id);
  }

  /**
   * Disable an entity.
   * @param {string} id - Entity Id
   */
  disable(id: string) {
    return this.model.findByIdAndUpdate(id, <UpdateQuery<D>>{ active: false}).exec();
  }

  /**
   * Create pagination query.
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   * @param {object} options -
   */
  paginationQueryOptions(pageNum: number, pageSize: number, options: any) {
    // if pageNum is null or pageSize == 0, then return ALL records
    options.skip = pageNum && pageSize > 0 ? pageSize * (pageNum - 1) : 0;
    options.limit = pageNum && pageSize > 0 ? pageSize : 0;
  }

  /**
   * Add search to query
   * @param {string} search
   * @param {array} fieldsSearch
   * @param {object} query
   */
  searchQueryOptions(
    search: string,
    fieldsSearch: Array<string>,
    query: FilterQuery<D>
  ) {
    let arrayQuery: any = [];
    fieldsSearch.forEach((e) => {
      let fieldQuery: any = {};
      fieldQuery[e] = new RegExp(search, "i");
      arrayQuery.push(fieldQuery);
    });
    query.$or = arrayQuery;
  }
}

export default Repository;
