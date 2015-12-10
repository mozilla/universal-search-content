import State from 'ampersand-state';
import {collect} from 'lodash';
import SearchSuggestions from '../collections/search_suggestions';
import SearchSuggestion from '../models/search_suggestion';
import webChannel from '../lib/web_channel';

const SearchSuggestionsAdapter = State.extend({
  props: {
    engine: 'string',
    searchTerm: 'string'
  },

  initialize () {
    this.maxLocalSuggestions = 2;
    this.maxCombinedSuggestions = 5;

    this.remoteSuggestions = new SearchSuggestions();
    this.localSuggestions = new SearchSuggestions();
    this.combinedSuggestions = new SearchSuggestions();

    webChannel.on('suggested-search-results', (data) => {
      if (data && data.results) {
        this.engine = data.engine;
        this.searchTerm = data.results.term;

        this.remoteSuggestions.reset(collect(data.results.remote, function (t) {
          return { term: t, type: 'remote' };
        }));
        this.localSuggestions.reset(collect(data.results.local, function (t) {
          return { term: t, type: 'local' };
        }));

        this.combineSuggestions();
      }
    });
  },

  combineSuggestions () {
    let remote = this.remoteSuggestions.models;
    let local = this.localSuggestions.models;

    let combined = local.slice(0, this.maxLocalSuggestions);
    combined = combined.concat(remote.slice(0, this.maxCombinedSuggestions - combined.length));

    // add the current search term when there are no results
    if (combined.length === 0) {
      combined.push(new SearchSuggestion({ term: this.searchTerm, type: 'remote' }));
    }

    this.combinedSuggestions.reset(combined);
  }
});

// export singleton
export default new SearchSuggestionsAdapter();
