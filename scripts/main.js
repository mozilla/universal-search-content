var SearchSuggestionsView = Backbone.View.extend({
  template: _.template($('#search-suggestions-template').html()),

  initialize: function () {
    this.terms = [];

    window.addEventListener('WebChannelMessageToContent', this.messageReceived.bind(this));
  },

  messageReceived: function (e) {
    var message = e.detail.message;

    if (message.type == 'suggested-search-results' && message.data && message.data.results) {
      this.terms = message.data.results.remote;
      this.render();
    }
  },

  render: function () {
    this.$el.html(this.template({ terms: this.terms }));
  }
});

var AwesomebarResultsView = Backbone.View.extend({
  template: _.template($('#awesomebar-results-template').html()),

  initialize: function () {
    this.results = [];

    window.addEventListener('WebChannelMessageToContent', this.messageReceived.bind(this));
  },

  messageReceived: function (e) {
    var message = e.detail.message;

    if (message.type == 'autocomplete-search-results' && message.data) {
      this.results = message.data;
      this.render();
    }
  },

  render: function () {
    this.$el.html(this.template({ results: this.results }));
  }
});


// Setup views
var searchSuggestionsView = new SearchSuggestionsView({ el: $('#search-suggestions')});
var awesomebarResultsView = new AwesomebarResultsView({ el: $('#awesomebar-results')});
