import State from 'ampersand-state';

export default State.extend({
  extraProperties: 'allow',

  resultType: 'url',
  derived: {
    result: {
      deps: ['url'],
      fn: function() {
        const prefix = this.type === 'action' ? 'moz-action:switchtab,' : '';
        return prefix + this.url;
      },
      cache: false
    },
    displayTitle: {
      deps: ['bookmark', 'title'],
      fn: function() {
        return this.bookmark ? this.bookmark.title : this.title;
      },
      cache: false
    },
    displayImage: {
      deps: ['imageData', 'image'],
      fn: function() {
        return this.imageData ? this.imageData : this.image;
      },
      cache: false
    }
  }
});
