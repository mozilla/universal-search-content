import BaseView from '../base_view';
import TopHitsIndexTemplate from '../../templates/top_hits/index.html';
import ActivityItemView from '../activity/activity_item_view';
import ActivityResults from '../../collections/activity_results';
import LilMacResults from '../../collections/lil_mac_results';
import activityResultsAdapter from '../../adapters/activity_results_adapter';
import lilMacAdapter from '../../adapters/lil_mac_adapter';

export default BaseView.extend({
  template: TopHitsIndexTemplate,

  initialize () {
    this.adapter = activityResultsAdapter;
    this.lilmac = lilMacAdapter;

    this.listenTo(this.adapter.results, 'reset', this.render);
    this.listenTo(this.lilmac.results, 'reset', this.render);
  },

  afterRender () {
    this.removeSubviews();

    // TODO: replace this with proper top hits dispatching
    this.renderCollection(this.wrapTopResult(this.adapter.results, ActivityResults), ActivityItemView, '.top-hits-results');

    // TODO: obviously this is insane. mix result types properly
    this.renderCollection(this.wrapTopResult(this.lilmac.results, LilMacResults), ActivityItemView, '.lil-mac-results');

    // if there are results then show otherwise hide
    (this.adapter.results.length || this.lilmac.results.length) ? this.show() : this.hide(); // eslint-disable-line no-unused-expressions
  },

  wrapTopResult (results, CollectionType) {
    return results.length ? new CollectionType([results.at(0)]) : new CollectionType();
  }
});
