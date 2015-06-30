import BaseView from './base_view';
import TopHitsIndexView from './top_hits/top_hits_index_view';
import SearchSuggestionsIndexView from './search_suggestions/search_suggestions_index_view';
import ActivityIndexView from './activity/activity_index_view';
import IndexTemplate from '../templates/index.html';
import webChannel from '../lib/web_channel';
import dom from 'ampersand-dom';

export default BaseView.extend({
  template: IndexTemplate,

  events: {
    'mouseenter': 'clearSelection'
  },

  initialize () {
    // listen for chrome key events
    this.listenTo(webChannel, 'navigational-key', this.dispatchKeypress);
  },

  afterRender () {
    this.renderSubview(new TopHitsIndexView());
    this.renderSubview(new SearchSuggestionsIndexView());
    this.renderSubview(new ActivityIndexView());
  },

  dispatchKeypress (data) {
    // down arrow and tab move down
    if (data.key === 'ArrowDown' || (data.key === 'Tab' && !data.shiftKey)) {
      this._selectNextItem(1);
    // up arrow and shift+tab move up
    } else if (data.key === 'ArrowUp' || (data.key === 'Tab' && data.shiftKey)) {
      this._selectNextItem(-1);
    }
  },

  clearSelection (e) {
    dom.removeClass(this.query('li.selected'), 'selected');
  },

  _selectNextItem (increment) {
    const items = document.querySelectorAll('li');
    var newlySelected;

    Array.prototype.some.call(items, function (item, i) {
      if (dom.hasClass(item, 'selected')) {
        const newIndex = i + increment;

        // wrap around backwards from first to last
        if (newIndex < 0) {
          newlySelected = items[items.length - 1];
        // wrap around from last to first
        } else if (newIndex === items.length) {
          newlySelected = items[0];
        } else {
          newlySelected = items[newIndex];
        }

        // remove selected class from currently selected item
        dom.removeClass(item, 'selected');

        return true;
      }
    });

    // if there wasn't a selected element then select one
    if (!newlySelected) {
      // choose the first if increment is positive otherwise choose the last
      if (increment > 0) {
        newlySelected = items[0];
      } else {
        newlySelected = items[items.length - 1];
      }
    }

    // add selected class to newly selected element and trigger our custom selection event
    dom.addClass(newlySelected, 'selected');
    newlySelected.dispatchEvent(new CustomEvent('select'));
  }
});
