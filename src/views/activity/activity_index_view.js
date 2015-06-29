import BaseView from '../base_view';
import ActivityIndexTemplate from '../../templates/activity/index.html';
import ActivityItemView from './activity_item_view';
import activityResultsAdapter from '../../adapters/activity_results_adapter';

export default BaseView.extend({
  template: ActivityIndexTemplate,

  initialize () {
    this.results = activityResultsAdapter.results;

    this.listenTo(this.results, 'reset', this.render);
  },

  beforeRender () {
    console.time('render: ActivityIndex');
  },

  afterRender () {
    this.renderCollection(this.results, ActivityItemView, '.activity-results');

    console.timeEnd('render: ActivityIndex');
  }
});
