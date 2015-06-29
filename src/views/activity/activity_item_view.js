import BaseView from '../base_view';
import ActivityItemView from '../../templates/activity/item.html';
import webChannel from '../../lib/web_channel';

export default BaseView.extend({
  template: ActivityItemView,

  events: {
    'click': 'openUrl',
    'select': 'sendSelectionDetails'
  },

  openUrl (event) {
    webChannel.sendAutocompleteClick(this.model.url, 'url');
  },

  sendSelectionDetails (event) {
    webChannel.sendUrlSelected(this.model.url, 'url');
  }
});
