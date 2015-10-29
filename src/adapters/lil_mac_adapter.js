import debounce from 'lodash.debounce';
import webChannel from '../lib/web_channel';
import LilMacResults from '../collections/lil_mac_results';

class LilMacAdapter {
  constructor () {
    this.results = new LilMacResults();
    webChannel.on('printable-key', debounce((data) => {
      this.search(data.query);
    }, 150));
  }

  search(term) {
    // XXX Override the search endpoint by setting window.app.searchUrl in a
    //     debugger window :-)
    const searchUrl = window.app.searchUrl || 'https://tiny-machine.herokuapp.com/search.json?q=';
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
export default new LilMacAdapter();
