import Ember from 'ember';

export default Ember.Service.extend({
  common: Ember.inject.service('common'),

  config: {
    username: "ashesofowls",
    displayName: "AshesOfOwls",
    channel: "#ashesofowls",
    oauth: "insert password here"
  },

  client: null,

  connect() {
    var client_options = {
      channels: [this.get('config').channel],
      options: { debug: true },
      connection: {
        cluster: "chat",
        reconnect: true
      },
      identity: {
        username: this.get('config').username,
        password: this.get('config').oauth
      }
    };

    var client = new irc.client(client_options);
    var promise = new $.Deferred();
    this.set('client', client);

    var self = this;
    client.connect().then(function() {
      self.get('common').updateModList();

      promise.resolve();
    })

    return promise;
  }
});
