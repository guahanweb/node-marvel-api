const extras = [{
  name: 'characters',
  route: '/characters'
}, {
  name: 'comics',
  route: '/comics'
}, {
  name: 'creators',
  route: '/creators'
}, {
  name: 'events',
  route: '/events'
}, {
  name: 'series',
  route: '/series'
}, {
  name: 'stories',
  route: '/stories'
}];

let handlers = {};
extras.forEach(extra => {
  handlers[extra.name] = function (params) {
    // when handling an extended route, we reset parameters
    // entirely.
    this.uri += extra.route;
    this.params = params;
    return this;
  };
});

module.exports = handlers;
