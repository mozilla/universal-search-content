import State from 'ampersand-state';

export default State.extend({
  extraProperties: 'allow',

  displayTitle () {
    return this.bookmark ? this.bookmark.title : this.title;
  },

  displayImage () {
    return this.imageData ? this.imageData : this.image;
  }
});
