# universal-search-content

the iframe that we put inside the autocomplete dropdown

## setup

1. `npm install -g harp`
2. `harp server`
3. navigate to <http://localhost:9000/>

## how to use with your custom gecko

1. make sure the server is running with `harp server`
2. grab the `hack-and-slash` branch of gecko-dev and replace [this line](https://github.com/the-super-friends/gecko-dev/blob/hack-and-slash/toolkit/content/widgets/autocomplete.xml#L1474) with the harp server url (http://localhost:9000/ by default)
3. build gecko-dev and bask in our collective glory

## documenting the postmessage API with the autocomplete code

https://gist.github.com/6a68/48bf56e5b66e8631b522
