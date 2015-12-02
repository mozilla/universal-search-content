import app from 'ampersand-app';
import BaseView from '../base_view';
import ActivityIndexTemplate from '../../templates/activity/index.html';
import ActivityItemView from './activity_item_view';
import activityResultsAdapter from '../../adapters/activity_results_adapter';
import ActivityResultsCollection from '../../collections/activity_results';

export default BaseView.extend({
  template: ActivityIndexTemplate,

  initialize () {
    this.adapter = activityResultsAdapter;

    this.listenTo(this.adapter.results, 'reset', this.render);
  },

  afterRender () {
    this.removeSubviews();
    let items = this.sliceCollection(this.adapter.results, ActivityResultsCollection, 1, 3);
    this.renderCollection(items, ActivityItemView, '.activity-results');

    // if there are results then show otherwise hide
    items.length ? this.show() : this.hide(); // eslint-disable-line no-unused-expressions

    app.trigger('needs-resized');
  }
});
