const { isNumeric } = require('../../helpers');

const Query = require('../query');
const { characters, comics, creators, events, series } = require('../add-ons');

/**
 * Build out and manage all paths for the /stories base API.
 * Inherits from the base Query object for execution and chaining.
 */
class StoryQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    if (isNumeric(params)) {
      super('/stories');
      addExtras.call(this, params);
    } else {
      super('/stories', params);
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
  this.events = events.bind(this);
  this.series = series.bind(this);
}

module.exports = function (params) {
  return new StoryQuery(params);
};
