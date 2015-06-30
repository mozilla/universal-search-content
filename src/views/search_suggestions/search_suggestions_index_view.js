import BaseView from '../base_view';
import SearchSuggestionsIndexTemplate from '../../templates/search_suggestions/index.html';
import SearchSuggestionsItemView from './search_suggestions_item_view';
import searchSuggestionsAdapter from '../../adapters/search_suggestions_adapter';

export default BaseView.extend({
  template: SearchSuggestionsIndexTemplate,

  initialize () {
    this.adapter = searchSuggestionsAdapter;

    this.listenTo(this.adapter.combinedSuggestions, 'reset', this.render);
  },

  beforeRender () {
    console.time('render: SearchSuggestionsIndex');
  },

  afterRender () {
    this.renderCollection(this.adapter.combinedSuggestions, SearchSuggestionsItemView, '.combined-search-suggestions');

    console.timeEnd('render: SearchSuggestionsIndex');
  }
});
