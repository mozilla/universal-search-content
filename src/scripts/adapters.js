searchSuggestionsAdapter = (function () {
  var instance = {};

  instance.remoteSuggestions = new Backbone.Collection();
  instance.localSuggestions = new Backbone.Collection();
  instance.searchTerm = '';

  instance.messageReceived = function (e) {
    var message = e.detail.message;
    if (!message) { return; }

    if (message.type == 'suggested-search-results' && message.data && message.data.results) {
      this.searchTerm = message.data.results.term;
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
    if (!message) { return; }

    if (message.type == 'autocomplete-search-results' && message.data) {
      this.results.reset(message.data);
    }
  };

  // Listen for WebChannel events
  window.addEventListener('WebChannelMessageToContent', instance.messageReceived.bind(instance));

  return instance;
})();

remoteTabsAdapter = (function () {
  var instance = {};

  instance.tabs = new Backbone.Collection();

  instance.messageReceived = function (e) {
    var message = e.detail.message;
    if (!message) { return; }

    var tabs = [];

    if (message.type == 'remote-tabs' && message.data && message.data.clients && message.data.clients.length) {
      message.data.clients.forEach(function(client) {
        client.tabs.forEach(function(tab) {
          tabs.push({
            device: client.clientName,
            isMobile: (client.class == 'mobile'),
            title: tab.title,
            url: tab.url
          });
        });
      });
      this.tabs.reset(tabs);
    }
  };

  // returns a Backbone Collection of tabs with url or title matching 'term'
  // using a case-insensitive simple substring match
  instance.matches = function(term) {
    if (!instance.tabs.length) { return; }

    var matchingTabs = instance.tabs.filter(function (tab) {
      return tab.get('title').toLowerCase().search(term.toLowerCase()) > -1 ||
               tab.get('url').toLowerCase().search(term.toLowerCase()) > -1;
    });

    if (matchingTabs.length) {
      return new Backbone.Collection(matchingTabs);
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
  instance.remoteTabs = remoteTabsAdapter.tabs;

  instance.calculateTopHits = function (e) {
    var topHits = [];

    topHits.push(this.results.first());

    var matches = remoteTabsAdapter.matches(searchSuggestionsAdapter.searchTerm);
    if (matches && matches.length) {
      topHits.push(matches.first());
    }

    this.hits.reset(topHits);
  };

  instance.remoteSuggestions.on('reset', instance.calculateTopHits, instance);
  instance.results.on('reset', instance.calculateTopHits, instance);
  instance.remoteTabs.on('reset', instance.calculateTopHits, instance);

  return instance;
})();
