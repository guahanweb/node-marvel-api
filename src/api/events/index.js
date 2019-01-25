const { isNumeric } = require('../../helpers');

const Query = require('../query');
const { characters, comics, creators, series, stories } = require('../add-ons');

/**
 * Build out and manage all paths for the /events base API.
 * Inherits from the base Query object for execution and chaining.
 */
class EventQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    if (isNumeric(params)) {
      super('/events');
      addExtras.call(this, params);
    } else {
      super('/events', params);
    }
  }
}

function addExtras(id) {
  this.uri += `/${id}`;
  this.params = {};

  // add functions here
  this.characters = characters.bind(this);
  this.comics = comics.bind(this);
  this.creators = creators.bind(this);
  this.series = series.bind(this);
  this.stories = stories.bind(this);
}

module.exports = function (params) {
  return new EventQuery(params);
};
