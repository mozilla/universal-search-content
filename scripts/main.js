function sendAutocompleteClick (result, resultType) {
  window.dispatchEvent(new window.CustomEvent('WebChannelMessageToChrome', {
    detail: {
      id: 'ohai',
      message: {
        type: 'autocomplete-url-clicked',
        data: {
          result: result,
          resultType: resultType
        }
      }
    }
  }));
}

function sendUrlSelected (result, resultType) {
  console.log("SEND URL SELECTED", result, resultType);

  window.dispatchEvent(new window.CustomEvent('WebChannelMessageToChrome', {
    detail: {
      id: 'ohai',
      message: {
        type: 'url-selected',
        data: {
          result: result,
          resultType: resultType
        }
      }
    }
  }));
}

function selectNextItem (increment) {
  var items = $('li').toArray();
  var selectionChanged = false;

  // Loop over the items to see if we should move the selected class
  items.some(function (item, i) {
    var $item = $(item);
    var $previousItem = $(items[i - increment]);

    if ($previousItem.hasClass('selected')) {
      $previousItem.removeClass('selected');
      $item.addClass('selected');

      return selectionChanged = true;
    }
  });

  // If we didn't change the selection then pick the first or last item depending current state
  // Note: The selection may not have changed because there is no selected item or because the
  // selected item was the last one on the page
  if (!selectionChanged) {
    var $previouslySelected = $('li.selected');

    if ($previouslySelected[0] === items[0]) {
      $('li').last().addClass('selected');
    } else {
      // This covers the case where no item was selected OR the last item was selected
      $('li').first().addClass('selected');
    }

    $previouslySelected.removeClass('selected');
  }

  // Send url or term up to the chrome
  var result = $('li.selected').find('.result-url, .result-term').text().trim();
  var resultType = $('li.selected .result-url').length ? 'url' : 'suggestion';

  sendUrlSelected(result, resultType);
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

    // HACK: handles missing favicons
    this.$el.find('img').error(function (event) {
      $(event.target).hide();
    }).load(function (event) {
      $(event.target).css({ 'visibility': 'visible' }).closest('.default-favicon').css({ 'background-image': 'none' });
    });

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
    var url = $(event.target).closest('.result').find('.result-term').text().trim();

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

    // HACK: handles missing favicons
    this.$el.find('img').error(function (event) {
      $(event.target).hide();
    }).load(function (event) {
      $(event.target).css({ 'visibility': 'visible' }).closest('.default-favicon').css({ 'background-image': 'none' });
    });

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


// Listen for key events from the chrome
window.addEventListener('WebChannelMessageToContent', function (event) {
  var message = event.detail.message;

  if (message.type === 'navigational-key' && message.data) {
    // Down arrow and tab move down
    if (message.data.key === 'ArrowDown' || (message.data.key === 'Tab' && !message.data.shiftKey)) {
      selectNextItem(1);
    // Up arrow and shift+tab move up
    } else if (message.data.key === 'ArrowUp' || (message.data.key === 'Tab' && message.data.shiftKey)) {
      selectNextItem(-1);
    }
  }
});

// Mouse events should clear arrow selection for now
$(window).mouseenter(function () {
  $('li.selected').removeClass('selected');
});

// Fix missing favicons

