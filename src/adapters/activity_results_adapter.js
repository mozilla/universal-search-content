import webChannel from '../lib/web_channel';
import ActivityResults from '../collections/activity_results';

class ActivityResultsAdapter {
  constructor () {
    this.results = new ActivityResults();

    webChannel.on('autocomplete-search-results', (data) => {
      this.results.reset(data);
    });
  }
}

// export singleton
export default new ActivityResultsAdapter();
