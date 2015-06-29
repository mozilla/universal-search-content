import webChannel from '../lib/web_channel';
import _c from 'lodash/collection';
import SearchSuggestions from '../collections/search_suggestions';

class SearchSuggestionsAdapter {
  constructor () {
    this.remoteSuggestions = new SearchSuggestions();
    this.localSuggestions = new SearchSuggestions();
    this.searchTerm = '';

    webChannel.on('suggested-search-results', (data) => {
      if (data && data.results) {
        this.searchTerm = data.results.term;
        this.remoteSuggestions.reset(_c.collect(data.results.remote, function (t) { return { term: t, type: 'remote' } }));
        this.localSuggestions.reset(_c.collect(data.results.local, function (t) { return { term: t, type: 'local' } }));
      }
    });
  }
}

// export singleton
export default new SearchSuggestionsAdapter();
