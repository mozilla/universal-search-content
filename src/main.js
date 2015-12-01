import app from 'ampersand-app';
import IndexView from './views/index_view';
import DebuggerIndexView from './views/debugger/debugger_index_view';
import initializeImageLoadListener from './lib/image_colors';
import './styles/main.scss';
import webChannelEventRecorder from './lib/web_channel_event_recorder';

app.extend({
  initialize () {
    this.renderIndexView();
    this.initializeWebChannelEventRecorder();
    this.initializeImageLoadListener();
  },

  renderIndexView () {
    this.indexView = new IndexView();

    document.body.appendChild(this.indexView.render().el);
  },

  initializeWebChannelEventRecorder () {
    if (webChannelEventRecorder.isEnabled()) {
      webChannelEventRecorder.record();
    }

    this.webChannelEventRecorder = webChannelEventRecorder;
  },

  showDebugger () {
    this.isDebugging = true;
    this.debuggerIndexView = new DebuggerIndexView();

    document.body.insertBefore(this.debuggerIndexView.render().el, document.body.firstChild);
  },

  initializeImageLoadListener () {
    initializeImageLoadListener();
  }
});

app.initialize();

// export app to console
window.app = app;
