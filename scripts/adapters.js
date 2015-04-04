searchSuggestionsAdapter = (function () {
  var instance = {};

  instance.remoteSuggestions = new Backbone.Collection();
  instance.localSuggestions = new Backbone.Collection();

  instance.messageReceived = function (e) {
    var message = e.detail.message;

    if (message.type == 'suggested-search-results' && message.data && message.data.results) {
      this.remoteSuggestions.reset(_.collect(message.data.results.remote, function (t) { return { term: t } }));
      this.localSuggestions.reset(_.collect(message.data.results.local, function (t) { return { term: t } }));
    }
  };

  // Listen for WebChannel events
  window.addEventListener('WebChannelMessageToContent', instance.messageReceived.bind(instance));

  return instance;
})();

autocompleteSearchResultsAdapter = (function () {
  var instance = {};

  instance.results = new Backbone.Collection();

  instance.messageReceived = function (e) {
    var message = e.detail.message;

    if (message.type == 'autocomplete-search-results' && message.data) {
      this.results.reset(message.data);
    }
  };

  // Listen for WebChannel events
  window.addEventListener('WebChannelMessageToContent', instance.messageReceived.bind(instance));

  return instance;
})();

topHitsAdapter = (function () {
  var instance = {};

  instance.hits = new Backbone.Collection();

  instance.remoteSuggestions = searchSuggestionsAdapter.remoteSuggestions;
  instance.results = autocompleteSearchResultsAdapter.results;

  instance.calculateTopHits = function (e) {
    this.hits.reset(this.results.first());
  };

  instance.remoteSuggestions.on('reset', instance.calculateTopHits, instance);
  instance.results.on('reset', instance.calculateTopHits, instance);

  return instance;
})();
