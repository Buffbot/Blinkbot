import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bots/requests/request-item', 'Integration | Component | bots/requests/request item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bots/requests/request-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#bots/requests/request-item}}
      template block text
    {{/bots/requests/request-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
