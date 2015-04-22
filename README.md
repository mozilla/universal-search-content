# universal-search-content

the iframe that we put inside the autocomplete dropdown

## branch info
this branch is for prototyping loose ideas for how the new dropdown
can be used. some of the ideas explored here are:

* site local search. when a user visits a site, the site may declare an available index through a meta description. firefox downloads this index, subjects it to a TTL, and serves results from this index in the time it's active.
* intent. can we defer intent from local signals (history, time of day, etc.) and use this intent to surface context-specific suggestions - e.g., "weather => weather card". the intent may also be signalled to the search engine
* full-text history search. why not archive my entire browsing history, index it, and surface content in the new bar
* ux experiments. test out far-out ux ideas
* ads. yeah, we all hate them, and it's what indirectly fuels our paycheck


## setup

1. `npm install -g harp`
2. `harp server`
3. navigate to <http://localhost:9000/>

## how to use with your custom gecko

1. make sure the server is running with `harp server`
2. build gecko-dev following [the instructions]()
3. when the custom nightly opens up, add prefs:
  - surf to `about:config`
  - create a new pref (right-click in the main pref area, then choose New > String)
  - name it `services.universalSearch.frameURL`
  - set its value to the complete path to the iframe URL, for example, `http://localhost:9000/index.html`
  - create another new String pref
  - name it `services.universalSearch.baseURL`
  - set its value to the scheme and domain part of the iframe URL, for example, `http://localhost:9000`
4. bask in our collective glory

## documenting the postmessage API with the autocomplete code

https://gist.github.com/6a68/48bf56e5b66e8631b522
