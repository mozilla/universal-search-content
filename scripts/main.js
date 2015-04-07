function sendAutocompleteClick (url, type) {
  window.dispatchEvent(new window.CustomEvent('WebChannelMessageToChrome', {
    detail: {
      id: 'ohai',
      message: {
        type: 'autocomplete-url-clicked',
        data: {
          result: url,
          resultType: type
        }
      }
    }
  }));
}

var TopHitsView = Backbone.View.extend({
  template: _.template($('#top-hits-template').html()),

  events: {
    'click': 'openUrl'
  },

  initialize: function () {
    this.hits = topHitsAdapter.hits;

    this.listenTo(this.hits, 'reset', this.render);
  },

  render: function () {
    this.$el.html(this.template({ hits: this.hits }));

    return this;
  },

  openUrl: function (event) {
    var url = $(event.target).closest('.result').find('.result-url').text().trim();

    sendAutocompleteClick(url, 'url');
  }
});

var SearchSuggestionsView = Backbone.View.extend({
  template: _.template($('#search-suggestions-template').html()),

  events: {
    'click': 'openSuggestion'
  },

  initialize: function () {
    this.remoteSuggestions = searchSuggestionsAdapter.remoteSuggestions;

    this.listenTo(this.remoteSuggestions, 'reset', this.render);
  },

  render: function () {
    this.$el.html(this.template({ remoteSuggestions: this.remoteSuggestions }));

    return this;
  },

  openSuggestion: function (event) {
    var url = $(event.target).closest('.result').find('.term').text().trim();

    sendAutocompleteClick(url, 'suggestion');
  }
});

var AutocompleteSearchResultsView = Backbone.View.extend({
  template: _.template($('#autocomplete-results-template').html()),

  events: {
    'click': 'openUrl'
  },

  initialize: function () {
    this.results = autocompleteSearchResultsAdapter.results;

    this.listenTo(this.results, 'reset', this.render);
  },

  render: function () {
    this.$el.html(this.template({ results: this.results }));

    return this;
  },

  openUrl: function (event) {
    var url = $(event.target).closest('.result').find('.result-url').text().trim();

    sendAutocompleteClick(url, 'url');
  }
});

// Initialize views
var topHitsView = new TopHitsView({ el: $('#top-hits')});
var searchSuggestionsView = new SearchSuggestionsView({ el: $('#search-suggestions')});
var autocompleteSearchResultsView = new AutocompleteSearchResultsView({ el: $('#autocomplete-results')});
