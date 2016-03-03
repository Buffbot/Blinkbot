import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["requests-request"],
  classNameBindings: ['isActive', 'isCurrent'],

  isActive: Ember.computed.alias('model.isActive'),
  isCurrent: Ember.computed.alias('model.isCurrent')
});
