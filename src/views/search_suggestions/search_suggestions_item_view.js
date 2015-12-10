import BaseView from '../base_view';
import SearchSuggestionsItemTemplate from '../../templates/search_suggestions/item.html';
import webChannel from '../../lib/web_channel';

export default BaseView.extend({
  template: SearchSuggestionsItemTemplate,

  events: {
    'mousedown': 'openUrl',
    'select': 'sendSelectionDetails'
  },

  openUrl (event) {
    // we have to use mousedown, not click, because of browser bugs.
    // see https://github.com/mozilla/universal-search-addon/issues/20 for more.
    if (event.which === 1) {
      webChannel.sendAutocompleteClick(this.model.result, this.model.resultType);
    }
  },

  sendSelectionDetails (event) {
    webChannel.sendUrlSelected(this.model.result, this.model.resultType);
  }
});
