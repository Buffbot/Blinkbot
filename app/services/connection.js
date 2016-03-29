import Ember from 'ember';
import ENV from "blinkbot/config/environment";

export default Ember.Service.extend({
  common: Ember.inject.service('common'),

  config: {
    username: ENV.USERNAME,
    displayName: ENV.DISPLAY_NAME,
    channel: ENV.CHANNEL,
    oauth: ENV.OAUTH
  },

  client: null,

  connect() {
    var client_options = {
      channels: [this.get('config').channel],
      options: { debug: true },
      connection: {
        cluster: "aws",
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
    });

    return promise;
  }
});
