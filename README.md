# This repo is deprecated

The `<iframe>` approach is presently on hold. Follow the latest [Universal Search](https://wiki.mozilla.org/Firefox/Universal_Search) developments at the [mozilla/universal-search](https://github.com/mozilla/universal-search) repository and on its [Waffle.io board](https://waffle.io/mozilla/universal-search). 

# universal-search-content

the iframe that we put inside the autocomplete dropdown

[![Build Status](https://travis-ci.org/mozilla/universal-search-content.svg?branch=master)](https://travis-ci.org/mozilla/universal-search-content)

## develop

1. `npm install`
2. `npm start`
3. navigate to <https://localhost:8080/>

## build

1. `npm run build`
2. find output in `dist/`

## postmessage API docs

https://github.com/mozilla/universal-search-addon/blob/master/docs/API.md

## debugging and performance tuning

1. Navigate to <https://localhost:8080/>
2. Show the debugger by running `app.showDebugger()` in the console
3. Enable event recording so that events can be replayed for debugging and performance tuning
