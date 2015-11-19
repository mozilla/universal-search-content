import BaseView from '../base_view';
import RecommendedItemView from '../../templates/recommended/item.html';
import webChannel from '../../lib/web_channel';

export default BaseView.extend({
  template: RecommendedItemView,

  events: {
    'mousedown': 'openUrl',
    'select': 'sendSelectionDetails'
  },

  openUrl (event) {
    // we have to use mousedown, not click, because of browser bugs.
    // see https://github.com/mozilla/universal-search-addon/issues/20 for more.
    if (event.which === 1) {
      webChannel.sendAutocompleteClick(this.model.url, 'url');
    }
  },

  sendSelectionDetails (event) {
    webChannel.sendUrlSelected(this.model.url, 'url');
  }
});
