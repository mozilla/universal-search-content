var searchField = document.getElementById('searchField');
var searchContent = document.getElementById('searchContent');
var searchWindow = searchContent.contentWindow;

searchField.focus();

var NAV_KEYS = ['Tab', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown'];

searchField.addEventListener('keypress', function (ev) {
  if (NAV_KEYS.indexOf(ev.key) === -1) { return; }
  ev.preventDefault();
  ev.stopPropagation();
  sendMsg("navigational-key", {
    key: ev.key,
    shift: ev.shiftKey
  });
});

searchWindow.addEventListener('WebChannelMessageToChrome', function (ev) {
  var message = ev.detail.message;
  if (!message) { return; }
  console.log(JSON.stringify(message, null, '  '));
});

searchContent.addEventListener('load', init);

function init () {

  sendMsg("autocomplete-search-results", [
    {
      "url": "https://www.mozilla.org/en-US/contribute/",
      "image": "http://www.mozilla.org/2005/made-up-favicon/2-1429726311236",
      "title": "Get Involved",
      "type": "bookmark",
      "text": "c"
    },
    {
      "url": "https://www.mozilla.org/en-US/firefox/customize/",
      "image": "http://www.mozilla.org/2005/made-up-favicon/1-1429726311235",
      "title": "Customize Firefox",
      "type": "bookmark",
      "text": "c"
    },
    {
      "url": "https://www.mozilla.org/en-US/firefox/central/",
      "image": null,
      "title": "Getting Started",
      "type": "bookmark",
      "text": "c"
    },
    {
      "url": "http://localhost:9000/index.html?cachebust=1430250484685",
      "image": null,
      "title": "",
      "type": "favicon",
      "text": "c"
    },
    {
      "url": "http://localhost:9000/index.html?cachebust=1430250072406",
      "image": null,
      "title": "",
      "type": "favicon",
      "text": "c"
    }
  ]);

  sendMsg("suggested-search-results", {
    "engine": "Yahoo",
    "results": {
      "term": "c",
      "remote": [
        "craigslist",
        "chase",
        "cnn",
        "costco",
        "capital one",
        "cool math games"
      ],
      "local": []
    }
  });

  sendMsg("remote-tabs", {
    "clients": [{
      "clientName": "Firefox on Nexus 9",
      "class": "mobile",
      "tabs": [{
        "title": "Tide Predictions - MONTEREY 9413450 Tidal Data Daily View - NOAA Tides & Currents",
        "url": "http://tidesandcurrents.noaa.gov/noaatidepredictions/viewDailyPredictions.jsp?Stationid=9413450",
        "icon": null
      }, {
        "title": "New Latin - Wikipedia, the free encyclopedia",
        "url": "http://en.m.wikipedia.org/wiki/New_Latin",
        "icon": "http://bits.wikimedia.org/favicon/wikipedia.ico"
      }]
    }]
  });

}

function sendMsg(type, data) {
  var ev = new searchWindow.CustomEvent('WebChannelMessageToContent', {
    detail: {
      id: 'ohai',
      message: { type: type, data: data }
    }
  });
  searchWindow.dispatchEvent(ev);
}
