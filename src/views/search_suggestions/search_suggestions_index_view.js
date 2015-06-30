import BaseView from '../base_view';
import SearchSuggestionsIndexTemplate from '../../templates/search_suggestions/index.html';
import SearchSuggestionsItemView from './search_suggestions_item_view';
import searchSuggestionsAdapter from '../../adapters/search_suggestions_adapter';

export default BaseView.extend({
  template: SearchSuggestionsIndexTemplate,

  initialize () {
    this.remoteSuggestions = searchSuggestionsAdapter.remoteSuggestions;
    this.localSuggestions = searchSuggestionsAdapter.localSuggestions;

    this.listenTo(this.localSuggestions, 'reset', this.render);
    this.listenTo(this.remoteSuggestions, 'reset', this.render);
  },

  beforeRender () {
    console.time('render: SearchSuggestionsIndex');
  },

  afterRender () {
    this.renderLocalSuggestions();
    this.renderRemoteSuggestions();

    console.timeEnd('render: SearchSuggestionsIndex');
  },

  renderLocalSuggestions () {
    this.renderCollection(this.localSuggestions, SearchSuggestionsItemView, '.local-search-suggestions');
  },

  renderRemoteSuggestions () {
    this.renderCollection(this.remoteSuggestions, SearchSuggestionsItemView, '.remote-search-suggestions');
  }
});
