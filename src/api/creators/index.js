const { isNumeric } = require('../../helpers');

const Query = require('../query');
const { comics, events, series, stories } = require('../add-ons');

/**
 * Build out and manage all paths for the /creators base API.
 * Inherits from the base Query object for execution and chaining.
 */
class CreatorQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    if (isNumeric(params)) {
      super('/creators');
      addExtras.call(this, params);
    } else {
      super('/creators', params);
    }
  }
}

function addExtras(id) {
  this.uri += `/${id}`;
  this.params = {};

  // add functions here
  this.comics = comics.bind(this);
  this.events = events.bind(this);
  this.series = series.bind(this);
  this.stories = stories.bind(this);
}

module.exports = function (params) {
  return new CreatorQuery(params);
};
