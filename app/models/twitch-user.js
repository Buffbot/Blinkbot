import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('String'),
  display: DS.attr('String')
});
