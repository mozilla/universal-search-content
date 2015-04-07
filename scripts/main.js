var TopHitsView = Backbone.View.extend({
  template: _.template($('#top-hits-template').html()),

  initialize: function () {
    this.hits = topHitsAdapter.hits;

    this.listenTo(this.hits, 'reset', this.render);
  },

  render: function () {
    this.$el.html(this.template({ hits: this.hits }));

    return this;
  }
});

var SearchSuggestionsView = Backbone.View.extend({
  template: _.template($('#search-suggestions-template').html()),

  initialize: function () {
    this.remoteSuggestions = searchSuggestionsAdapter.remoteSuggestions;

    this.listenTo(this.remoteSuggestions, 'reset', this.render);
  },

  render: function () {
    this.$el.html(this.template({ remoteSuggestions: this.remoteSuggestions }));

    return this;
  }
});

var AutocompleteSearchResultsView = Backbone.View.extend({
  template: _.template($('#autocomplete-results-template').html()),

  initialize: function () {
    this.results = autocompleteSearchResultsAdapter.results;

    this.listenTo(this.results, 'reset', this.render);
  },

  render: function () {
    this.$el.html(this.template({ results: this.results }));

    return this;
  }
});


// Initialize views
var topHitsView = new TopHitsView({ el: $('#top-hits')});
var searchSuggestionsView = new SearchSuggestionsView({ el: $('#search-suggestions')});
var autocompleteSearchResultsView = new AutocompleteSearchResultsView({ el: $('#autocomplete-results')});
