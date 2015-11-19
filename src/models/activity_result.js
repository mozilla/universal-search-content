import State from 'ampersand-state';

export default State.extend({
  extraProperties: 'allow',

  faviconUrl () {
    return 'https://summarizer.dev.mozaws.net/favicons?url=' + encodeURIComponent(this.url);
  },

  mozAction () {
    const action = /^moz\-action\:([^,]+),/.exec(this.url);
    return (action && action.length > 1) ? action[1] : 'other';
  }
});
