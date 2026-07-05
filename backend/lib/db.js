const { Collection } = require('./store');

const collections = {};

function model(name) {
  if (!collections[name]) {
    collections[name] = new Collection(name);
  }
  return collections[name];
}

module.exports = { model };
