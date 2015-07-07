import BaseView from '../base_view';
import DebuggerIndexTemplate from '../../templates/debugger/index.html';
import webChannelEventRecorder from '../../lib/web_channel_event_recorder';

export default BaseView.extend({
  template: DebuggerIndexTemplate,

  events: {
    'click .replay-this': 'replayThis',
    'click .replay-next': 'replayNext',
    'click .replay-ten': 'replayTen',
    'click .toggle-recorder': 'toggleRecorder'
  },

  initialize () {
    this.eventIndex = 0;

    this.replayNext();
  },

  afterRender () {
    this.initToggleRecorder();
  },

  initToggleRecorder () {
    this.query('.toggle-recorder').checked = webChannelEventRecorder.isEnabled();
  },

  toggleRecorder () {
    if (this.query('.toggle-recorder').checked) {
      webChannelEventRecorder.enable();
    } else {
      webChannelEventRecorder.disable();
    }
  },

  replayThis () {
    webChannelEventRecorder.replay('autocomplete-search-results', 1, this.eventIndex - 1);
    webChannelEventRecorder.replay('suggested-search-results', 1, this.eventIndex - 1);
  },

  replayNext () {
    webChannelEventRecorder.replay('autocomplete-search-results', 1, this.eventIndex);
    webChannelEventRecorder.replay('suggested-search-results', 1, this.eventIndex);

    this.eventIndex++;
  },

  replayTen () {
    webChannelEventRecorder.replay('autocomplete-search-results', 10);
    webChannelEventRecorder.replay('suggested-search-results', 10);

    this.eventIndex = 0;
  }
});
