import State from 'ampersand-state';

export default State.extend({
  extraProperties: 'allow',

  faviconUrl () {
    return 'https://summarizer.dev.mozaws.net/favicons?url=' + encodeURIComponent(this.url);
  }
});
