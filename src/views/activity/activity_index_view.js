import BaseView from '../base_view';
import ActivityIndexTemplate from '../../templates/activity/index.html';
import ActivityItemView from './activity_item_view';
import activityResultsAdapter from '../../adapters/activity_results_adapter';

export default BaseView.extend({
  template: ActivityIndexTemplate,

  initialize () {
    this.adapter = activityResultsAdapter;

    this.listenTo(this.adapter.results, 'reset', this.render);
  },

  afterRender () {
    this.removeSubviews();
    this.renderCollection(this.adapter.results, ActivityItemView, '.activity-results');

    // if there are results then show otherwise hide
    this.adapter.results.length ? this.show() : this.hide(); // eslint-disable-line no-unused-expressions
  }
});
