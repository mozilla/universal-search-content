import RowItemView from '../row_item_view';
import SearchSuggestionsItemTemplate from '../../templates/search_suggestions/item.html';

export default RowItemView.extend({
  template: SearchSuggestionsItemTemplate,

  events: RowItemView.prototype.events

});
