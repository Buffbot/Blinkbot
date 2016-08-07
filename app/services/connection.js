import Ember from 'ember';

export default Ember.Service.extend({
  common: Ember.inject.service('common'),

  username: "",
  channel_name: "#",
  oauth: "",

  client: null,

  connect() {
    var client_options = {
      channels: [this.get('channel_name')],
      options: { debug: true },
      connection: {
        cluster: "chat",
        reconnect: true
      },
      identity: {
        username: this.get('username'),
        password: this.get('oauth')
      }
    };

    var client = new irc.client(client_options);
    var promise = new $.Deferred();
    this.set('client', client);

    var self = this;

    client.on("connected", function() {
      self.get('common').updateModList();
      self.get('common').listenForNames();

      promise.resolve();
    })

    client.connect()

    return promise;
  }
});
