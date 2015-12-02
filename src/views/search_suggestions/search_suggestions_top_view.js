import app from 'ampersand-app';
import BaseView from '../base_view';
import SearchSuggestionsTopTemplate from '../../templates/search_suggestions/top.html';
import SearchSuggestionsCollection from '../../collections/search_suggestions';
import SearchSuggestionsItemView from './search_suggestions_item_view';
import searchSuggestionsAdapter from '../../adapters/search_suggestions_adapter';

export default BaseView.extend({
  template: SearchSuggestionsTopTemplate,

  initialize () {
    this.adapter = searchSuggestionsAdapter;
    this.listenTo(this.adapter.combinedSuggestions, 'reset', this.render);
  },

  afterRender () {
    this.removeSubviews();
    let items = this.sliceCollection(this.adapter.combinedSuggestions, SearchSuggestionsCollection, 0, 1);
    this.renderCollection(items, SearchSuggestionsItemView, '.top-search-suggestion');
    app.trigger('needs-resized');
  }
});
