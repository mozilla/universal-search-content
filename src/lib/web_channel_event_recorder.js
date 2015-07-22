import app from 'ampersand-app';

class WebChannelEventRecorder {
  constructor () {
    this.namespace = 'wcer-';
    this.maxEvents = 100;
  }

  record () {
    window.addEventListener('WebChannelMessageToContent', this._messageReceived.bind(this));
  }

  replay (eventName, max = 1, offset = 0) {
    let details = this._getItem(eventName);

    if (!details) {
      return;
    }

    let eventsToReplay = max > 0 ? details.slice(offset, offset + max) : details;

    eventsToReplay.forEach((detail) => { this._triggerMessageToContent(detail); });
  }

  replayAll (eventName) {
    this.replay(eventName, -1);
  }


  enable () {
    return localStorage.setItem('WebChannelEventRecorder.enabled', 'true');
  }

  disable () {
    return localStorage.removeItem('WebChannelEventRecorder.enabled');
  }

  isEnabled () {
    return !!localStorage.getItem('WebChannelEventRecorder.enabled');
  }

  _messageReceived (e) {
    const message = e.detail.message;

    if (message && message.type) {
      this._record(message.type, e.detail);
    }
  }

  _record (eventName, detail) {
    // don't record events if the app is being debugged
    if (app.isDebugging) {
      return;
    }

    let details = this._getItem(eventName) || [];

    // add item to the top
    details.unshift(detail);

    // only keep the last this.maxEvents
    if (details.length >= this.maxEvents) {
      details = details.slice(0, this.maxEvents);
    }

    this._setItem(eventName, details);
  }

  _getItem (key) {
    let value = localStorage.getItem(this.namespace + key);

    return value ? JSON.parse(value) : value;
  }

  _setItem (key, value) {
    localStorage.setItem(this.namespace + key, JSON.stringify(value));
  }

  _triggerMessageToContent (detail) {
    window.dispatchEvent(new window.CustomEvent('WebChannelMessageToContent', { detail: detail }));
  }
}

export default new WebChannelEventRecorder();
