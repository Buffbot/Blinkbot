import Ember from 'ember';

export default Ember.Controller.extend({
  connection: Ember.inject.service('connection'),

  username: Ember.computed.alias("connection.username"),
  channel: Ember.computed.alias("connection.channel_name"),
  oauth: Ember.computed.alias("connection.oauth"),

  connected: false,
  connecting: false,

  actions: {
    connect: function() {
      var _self = this;

      this.get('connection').connect();
      _self.set("connecting", true);

      this.get('connection.client').on("connected", function() {
        _self.set("connected", true);
      })
    }
  }
})
