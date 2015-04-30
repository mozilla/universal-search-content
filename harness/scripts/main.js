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

  if (false) sendMsg("empty-popup",     {
        "frecentLinks": [{
            "url": "http://localhost:8080/",
            "title": "Chronicle",
            "frecency": 642857,
            "lastVisitDate": 1428951737668334,
            "type": "history"
        }, {
            "url": "http://maps.google.com/",
            "title": "Google Maps",
            "frecency": 280838,
            "lastVisitDate": 1428606418389887,
            "type": "history"
        }, {
            "url": "https://etherpad.mozilla.org/chronicle-daily",
            "title": "MoPad: chronicle-daily",
            "frecency": 28764,
            "lastVisitDate": 1427130442419950,
            "type": "history"
        }, {
            "url": "http://flytrapinteractive.com/~complimentary/iching/",
            "title": "I Ching Online",
            "frecency": 24274,
            "lastVisitDate": 1428242841058000,
            "type": "history"
        }, {
            "url": "https://news.ycombinator.com/",
            "title": "Hacker News",
            "frecency": 22847,
            "lastVisitDate": 1428687456020616,
            "type": "history"
        }, {
            "url": "http://foo.com/",
            "title": "Foo.com",
            "frecency": 21411,
            "lastVisitDate": 1428692685196443,
            "type": "history"
        }, {
            "url": "https://air.mozilla.org/",
            "title": "Air Mozilla | Mozilla, in Video",
            "frecency": 20888,
            "lastVisitDate": 1429030885422617,
            "type": "history"
        }, {
            "url": "https://chat.meatspac.es/",
            "title": "meatspace",
            "frecency": 18428,
            "lastVisitDate": 1424314442548979,
            "type": "history"
        }, {
            "url": "http://www.weather.gov/",
            "title": "National Weather Service",
            "frecency": 15580,
            "lastVisitDate": 1428021239189523,
            "type": "history"
        }, {
            "url": "http://emojicons.com/hall-of-fame",
            "title": "Hall of Fame :: Emojicons",
            "frecency": 15400,
            "lastVisitDate": 1429131375931853,
            "type": "history"
        }],
        "searches": {
            "searchEngineName": "Google",
            "results": [{
                "searchTerms": "pacific grove post office",
                "result": {
                    "url": "https://www.google.com/maps/place/US+Post+Office/@36.622612,-121.920242,15z/data=!4m2!3m1!1s0x0:0xd87c3fefe707b0e3?sa=X&ei=rO0uVZW-NcyRyASnuIGwDA&ved=0CIABEPwSMAo",
                    "title": "US Post Office - Google Maps"
                }
            }, {
                "searchTerms": "youtube thelonious monk misterioso",
                "result": {
                    "url": "http://en.wikipedia.org/wiki/Misterioso_(Thelonious_Monk_album)",
                    "title": "Misterioso (Thelonious Monk album) - Wikipedia, the free encyclopedia"
                }
            }, {
                "searchTerms": "neilsen satisficing",
                "result": {
                    "url": "http://www.nngroup.com/articles/satisficing/",
                    "title": "Satisficing in UX Design: Fast Access to Good-Enough Stuff"
                }
            }, {
                "searchTerms": "sqlite full text search",
                "result": {
                    "url": "http://www.xojo.com/blog/en/2014/03/full-text-search-with-sqlite.php",
                    "title": "Xojo: Blog: Full Text Search with SQLite"
                }
            }, {
                "searchTerms": "psql commands",
                "result": {
                    "url": "http://www.postgresonline.com/downloads/special_feature/postgresql83_psql_cheatsheet.pdf",
                    "title": "PSQL 8.3 Cheatsheet - postgresql83_psql_cheatsheet.pdf"
                }
            }]
        }
    });

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
