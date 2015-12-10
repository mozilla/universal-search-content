import State from 'ampersand-state';

export default State.extend({
  extraProperties: 'allow',

  // TODO: better name?
  resultType: 'suggestion',
  derived: {
    result: {
      deps: ['term'],
      fn: function() {
        return this.term;
      },
      cache: false
    }
  }
});
