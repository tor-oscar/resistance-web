Resistance.ApplicationRoute = Ember.Route.extend({
  beforeModel: function() {
    var route = this;
    var store = this.store;
    store.find('session', 'current').then(function (session) {
      Resistance.csrfToken = session.get('csrfToken');
      if (session.get('user')) {
        session.get('user').then(function (user) {
          route.controllerFor('application').set('currentUser', user);
        });
      }
    });
    this.setupSocket();
  },
  setupSocket: function () {
    if (this.get('socket')) {
      this.get('socket').disconnect();
    }
    var socket = new WebSocketRails('localhost:3000/websocket');
    socket.on_open = function (event) {
    };
    socket.bind("game.update", function (data) {
      this.store.serializerFor('game').pushPayload(this.store, data);
    }.bind(this));
    this.set('socket', socket);
  },
  actions: {
    dev_login: function (id) {
      var route = this;
      var store = this.store;
      route.controllerFor('application').set('currentUser', null);
      store.find('session', 'current').then(function (session) {
        session.destroyRecord().then(function () {
          store.find('session', 'current').then(function (session) {
            Resistance.csrfToken = session.get('csrfToken');
            Ember.$.post('/sessions', { user: {
              email: 'test'+id+'@test.com',
              password: 'jagkan'
            }}).then(function (response) {
              session.reload().then(function () {
                Resistance.csrfToken = session.get('csrfToken');
                route.setupSocket();
                if (session.get('user')) {
                  session.get('user').then(function (user) {
                    route.controllerFor('application').set('currentUser', user);
                    route.controllerFor('game').get('model').reload();
                  });
                }
              });
            });
          });
        });
      });
    }
  }
});
