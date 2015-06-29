import BaseView from '../base_view';
import SearchSuggestionsItemTemplate from '../../templates/search_suggestions/item.html';
import webChannel from '../../lib/web_channel';

export default BaseView.extend({
  template: SearchSuggestionsItemTemplate,

  events: {
    'click': 'openSuggestion',
    'select': 'sendSelectionDetails'
  },

  openSuggestion (event) {
    webChannel.sendAutocompleteClick(this.model.term, 'suggestion');
  },

  sendSelectionDetails (event) {
    webChannel.sendUrlSelected(this.model.term, 'suggestion');
  }
});
