const Repository = require('../../src/repositories/repository')
const mongoose = require('mongoose');
const fakeModel = mongoose.Schema({});
const fakeRepository = new Repository(fakeModel);

describe('repository - paginationQueryOptions, returns the number of records to skip and the limit to obtain', () => {
  test('Page 1, size 10 records, skipping 0', () => {
    const options = {}

    fakeRepository.paginationQueryOptions(1, 10, options);

    expect(options.skip).toBe(0);
    expect(options.limit).toBe(10);
  });

  test('Page 5, size 25 records, skipping 100', () => {
    const options = {}

    fakeRepository.paginationQueryOptions(5, 25, options);

    expect(options.skip).toBe(100);
    expect(options.limit).toBe(25);
  });

  test('Page 1, size 0 records, return all of records', () => {
    const options = {}

    fakeRepository.paginationQueryOptions(1, 0, options);

    expect(options.skip).toBe(0);
    expect(options.limit).toBe(0);
  });

  test('Page 0, return all of records', () => {
    const options = {}
  
    fakeRepository.paginationQueryOptions(0, 10, options);
    
    expect(options.skip).toBe(0);
    expect(options.limit).toBe(0);
  });
});

describe('repository - searchQueryOptions, returns the regex pattern to search into an "or" query containing the fields to search', () => {
  test('Search "test" into 4 fields to search', () => {
    const query = {};
    const search = 'test';
    const fieldsSearch = ['name', 'email', 'surname', 'username'];

    fakeRepository.searchQueryOptions(search, fieldsSearch, query)

    expect(query).toEqual({
      '$or': [
        { name: /test/i },
        { email: /test/i },
        { surname: /test/i },
        { username: /test/i }
      ]
    });
  });

  test('Search an empty string into 4 fields', () => {
    const query = {};
    const search = '';
    const fieldsSearch = ['name', 'email', 'surname', 'username'];

    fakeRepository.searchQueryOptions(search, fieldsSearch, query)

    expect(query).toEqual({
      '$or': [
        { name: /(?:)/i },
        { email: /(?:)/i },
        { surname: /(?:)/i },
        { username: /(?:)/i }
      ]
    });
  });

  test('Search "test" into 0 fields', () => {
    const query = {};
    const search = 'test';
    const fieldsSearch = [];

    fakeRepository.searchQueryOptions(search, fieldsSearch, query)

    expect(query).toEqual({ '$or': [] });
  });

  test('Search an empty string into 0 fields', () => {
    const query = {};
    const search = 'test';
    const fieldsSearch = [];

    fakeRepository.searchQueryOptions(search, fieldsSearch, query)

    expect(query).toEqual({ '$or': [] });
  });
});