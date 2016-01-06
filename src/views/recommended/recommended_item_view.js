import RecommendedItemTemplate from '../../templates/recommended/item.html';
import RowItemView from '../row_item_view';

export default RowItemView.extend({
  template: RecommendedItemTemplate,

  events: RowItemView.prototype.events

});
