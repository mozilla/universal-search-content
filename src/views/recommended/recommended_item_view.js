import RecommendedItemView from '../../templates/recommended/item.html';
import RowItemView from '../row_item_view';

export default RowItemView.extend({
  template: RecommendedItemView,

  events: RowItemView.prototype.events

});
