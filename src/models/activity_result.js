import Model from 'ampersand-model';

export default Model.extend({
  props: {
    title: 'string',
    type: 'string',
    url: 'string'
  },

  derived: {
    displayName: {
      deps: ['title', 'url'],
      fn () {
        return this.title || this.url;
      }
    },

    faviconUrl: {
      deps: ['url'],
      fn () {
        return 'https://summarizer.dev.mozaws.net/favicons?url=' + encodeURIComponent(this.url);
      }
    }
  },
});
