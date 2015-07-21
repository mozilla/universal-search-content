import BaseView from '../base_view';
import TopHitsIndexTemplate from '../../templates/top_hits/index.html';
import ActivityItemView from '../activity/activity_item_view';
import ActivityResults from '../../collections/activity_results';
import activityResultsAdapter from '../../adapters/activity_results_adapter';

export default BaseView.extend({
  template: TopHitsIndexTemplate,

  initialize () {
    this.adapter = activityResultsAdapter;

    this.listenTo(this.adapter.results, 'reset', this.render);
  },

  beforeRender () {
    console.time('render: TopHitsIndex');
  },

  afterRender () {
    // TODO: replace this with proper top hits dispatching
    this.renderCollection(new ActivityResults([this.adapter.results.at(0)]), ActivityItemView, '.top-hits-results');

    // if there are results then show otherwise hide
    this.adapter.results.length ? this.show() : this.hide(); // eslint-disable-line no-unused-expressions

    console.timeEnd('render: TopHitsIndex');
  }
});
