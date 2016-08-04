import Ember from 'ember';

export default Ember.Service.extend({
  connection: Ember.inject.service('connection'),
  modsList: null,

  say(message) {
    var channel = this.get('connection.channel_name');
    this.get('connection.client').say(channel, message);
  },

  mentionSay(user, message) {
    var display_name = user['display-name'] || user.get('display');
    message = `@${display_name}, ${message}`;

    this.say(message);
  },

  updateModList() {
    var current_channel = this.get('connection.channel_name');
    var channel_admin = current_channel.split("#")[1];
    var modsList = [channel_admin];

    var self = this;

    this.get('connection.client').mods(current_channel).then(function(data) {
      modsList = modsList.concat(data);
      self.set('modsList', modsList);
    });
  },

  isAdmin(username) {
    return this.get('modsList').indexOf(username) >= 0;
  }
});
