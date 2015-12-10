import app from 'ampersand-app';
import {debounce} from 'lodash';
import webChannel from '../lib/web_channel';
import RecommendedResults from '../collections/recommended_results';

class RecommendedAdapter {
  constructor () {
    this.results = new RecommendedResults();
    webChannel.on('printable-key', debounce((data) => {
      // Trim whitespace before performing search; don't attempt to search for
      // whitespace-only strings; clear results if the current query is only
      // whitespace.
      let query = data.query.trim();
      if (query.length) {
        this.search(query);
      } else {
        this.results.reset();
      }
    }, 150));
  }

  search(term) {
    // XXX Override the search endpoint by setting window.app.searchUrl in a
    //     debugger window :-)
    const searchUrl = app.searchUrl || 'https://tiny-machine.herokuapp.com/search.json?q=';
    const url = searchUrl + encodeURI(term);
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.onload = () => {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 202)) {
        let results = [];
        try {
          results = JSON.parse(xhr.response);
        } catch (e) {} // eslint-disable-line no-empty
        this.results.reset(results);
      }
    };
    xhr.send();
  }

}

// export singleton
export default new RecommendedAdapter();
