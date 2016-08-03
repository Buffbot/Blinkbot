import Ember from 'ember';

export default Ember.Controller.extend({
  requester: Ember.inject.service('requests'),

  requests: Ember.computed.alias('requester.sorted_requests'),
  active_requests: Ember.computed.alias('requester.active_requests'),

  listenForRequests: Ember.on('init', function() {
    this.get('requester').enable();
  })
})
