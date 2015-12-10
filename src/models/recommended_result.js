import State from 'ampersand-state';

export default State.extend({
  extraProperties: 'allow',

  resultType: 'url',
  derived: {
    result: {
      deps: ['url'],
      fn: function() {
        return this.url;
      },
      cache: false
    },
    faviconUrl: {
      deps: ['favicon'],
      fn: function() {
        if (this.favicon) {
          return this.favicon.url;
        }
      },
      cache: false
    }
  }
});

