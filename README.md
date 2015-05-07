# universal-search-content

the iframe that we put inside the autocomplete dropdown

## setup

1. `npm install`
2. `gulp`
3. navigate to <http://localhost:9000/harness/>

## how to use with your custom gecko

1. make sure the server is running with `gulp`
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

## how to deploy to Amazon S3

1. Copy `gulpconfig.js-dist` to `gulpconfig.js`
2. Edit `gulpconfig.js` and add your AWS credentials and S3 bucket
3. `gulp deploy` to deploy everything
4. `gulp deploy:base` to deploy just the base app, without the dev harness

## documenting the postmessage API with the autocomplete code

https://gist.github.com/6a68/48bf56e5b66e8631b522
