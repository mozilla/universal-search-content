import app from 'ampersand-app';
import BaseView from '../base_view';
import RecommendedIndexTemplate from '../../templates/recommended/index.html';
import RecommendedItemView from './recommended_item_view';
import RecommendedResults from '../../collections/recommended_results';
import RecommendedAdapter from '../../adapters/recommended_adapter';

export default BaseView.extend({
  template: RecommendedIndexTemplate,

  initialize () {
    this.Recommended = RecommendedAdapter;
    this.listenTo(this.Recommended.results, 'reset', this.render);
  },

  afterRender () {
    this.removeSubviews();
    let items = this.sliceCollection(this.Recommended.results,
                                     RecommendedResults, 0, 1);
    this.renderCollection(items, RecommendedItemView,
                          '.recommended-results');

    // if there are results then show otherwise hide
    this.Recommended.results.length ? this.show() : this.hide(); // eslint-disable-line no-unused-expressions

    app.trigger('needs-resized');
  }
});
