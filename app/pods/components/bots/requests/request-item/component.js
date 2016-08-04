import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["requests-request"],
  classNameBindings: ['isActive', 'isCurrent', 'isHidden'],

  isActive: Ember.computed.alias('model.isActive'),
  isCurrent: Ember.computed.alias('model.isCurrent'),
  isHidden: Ember.computed.alias('model.isHidden')
});
