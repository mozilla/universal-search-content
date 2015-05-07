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

      window.dispatchEvent(new window.CustomEvent('selectionChanged', { detail: { url: $item.find('.result-url').text().trim() } }));
      return selectionChanged = true;
    }
  });

  // If we didn't change the selection then pick the first or last item depending current state
  // Note: The selection may not have changed because there is no selected item or because the
  // selected item was the last one on the page
  if (!selectionChanged) {
    var $previouslySelected = $('li.selected'),
      $newlySelected;

    if ($previouslySelected[0] === items[0]) {
      $newlySelected = $('li').last();
      $newlySelected.addClass('selected');
    } else {
      // This covers the case where no item was selected OR the last item was selected
      $newlySelected = $('li').first();
      $newlySelected.addClass('selected');
    }

    window.dispatchEvent(new window.CustomEvent('selectionChanged', { detail: { url: $newlySelected.find('.result-url').text().trim() } }));
    $previouslySelected.removeClass('selected');
  }

  // Send url or term up to the chrome
  var result = $('li.selected').find('.result-url, .result-term').text().trim();
  var resultType = $('li.selected .result-url').length ? 'url' : 'suggestion';

  sendUrlSelected(result, resultType);
}

function extractUrl (url) {
  var deferred = $.Deferred();
  var cacheKey = 'embedly-extract-' + url;

  // check for cached copy in sessionStorage
  var result = sessionStorage.getItem(cacheKey);

  if (result) {
    deferred.resolve(JSON.parse(result));
  } else {
    var ajaxDeferred = $.ajax({
      url: 'https://summarizer.dev.mozaws.net/embedly/1/extract',
      data: { url: url }
    });

    ajaxDeferred.done(function onResolved(result) {
      // grab the few bits we need in the DOM
      var data = {
        url: result.url,
        title: result.title,
        description: result.description,
        providerTitle: result.provider_name || result.provider_display,
        faviconUrl: result.favicon_url
      };

      if (result.images && result.images.length) {
        var image = result.images[0];

        if (image.width && image.width >= 300) {
          data.imageUrl = image.url;
        }
      }

      // cache in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(data));

      return deferred.resolve(data);
    });

    ajaxDeferred.fail(function onError(jqXHR, textStatus, errorThrown) {
      console.log("failed to scrape page " + url + ": ", textStatus);

      return deferred.reject(textStatus, errorThrown);
    });
  }

  return deferred;
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

// listen for the selected event
// when something gets selected, grab its url, xhr a preview from embedly
// when the embedly data returns, render it
// hide yourself when the selection is empty or the page visibility changes
// TODO use embedly's Display API to get a nicely-sized image
var ContentPreviewView = Backbone.View.extend({
  template: _.template($('#content-preview-template').html()),

  initialize: function() {
    window.addEventListener('selectionChanged', this.onSelectionChanged.bind(this));

    // XXX this might be a mistake, do we even know if the page continues to
    //     run after the popup is dismissed?
    $(document).on('visibilitychange', this.onVisibilityChanged.bind(this));
  },

  onSelectionChanged: function($item) {
    if (!$item) {
      this.hide();
    } else {
      this.render($item);
    }
  },

  // TODO will we even need this? or does the iframe close/reopen itself automatically?
  onVisibilityChanged: function() {
    if (document.visibilityState == "hidden") {
      this.hide();
    }
  },

  _render: function(stuff) {
    // actually render the right pane using data returned by embedly
    // TODO: spinners / transitions / perceived performance tweaks (use url and title until img/desc are available?)
    this.$el.html(this.template({ result: stuff }));
    this.show();
  },

  render: function(evt) {
    // grab URL out of the event
    var url = evt.detail.url;

    // Hide the preview pane while we get the new result
    this.hide();

    // if it's a search suggestion or a useless url just bail
    if (!url || url.match(/localhost/) || !url.match(/https?/)) {
      return;
    }

    var deferred = extractUrl(url);

    deferred.done(function (data) {
      this._render(data);
    }.bind(this));

    deferred.fail(function () {
      this.hide();
    }.bind(this));
  },

  // TODO effects? maybe an extremely short fade on show?
  hide: function() {
    this.$el.hide();
  },

  show: function() {
    this.$el.show();
  }
});

// Initialize views
var topHitsView = new TopHitsView({ el: $('#top-hits')});
var searchSuggestionsView = new SearchSuggestionsView({ el: $('#search-suggestions')});
var autocompleteSearchResultsView = new AutocompleteSearchResultsView({ el: $('#autocomplete-results')});
var contentPreviewView = new ContentPreviewView({ el: $('#content-preview') });

// Listen for key events from the chrome
window.addEventListener('WebChannelMessageToContent', function (event) {
  var message = event.detail.message;
  if (!message) { return; }

  if (message.type === 'navigational-key' && message.data) {
    // Down arrow and tab move down
    if (message.data.key === 'ArrowDown' || (message.data.key === 'Tab' && !message.data.shiftKey)) {
      // fire a selected change event
      selectNextItem(1);
    // Up arrow and shift+tab move up
    } else if (message.data.key === 'ArrowUp' || (message.data.key === 'Tab' && message.data.shiftKey)) {
      // fire a selected change event
      selectNextItem(-1);
    }
  }
});

// Mouse events should clear arrow selection for now
$(window).mouseenter(function () {
  $('li.selected').removeClass('selected');
});
