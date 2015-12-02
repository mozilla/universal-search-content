import Events from 'ampersand-events';

class WebChannel {
  constructor () {
    // turn this into an event emitter
    Events.createEmitter(this);

    // listen for WebChannel messages
    window.addEventListener('WebChannelMessageToContent', this._messageReceived.bind(this));

    this.channelId = null;
  }

  sendMessage (type, data) {
    window.dispatchEvent(new window.CustomEvent('WebChannelMessageToChrome', {
      detail: {
        id: this.channelId,
        message: {
          type: type,
          data: data
        }
      }
    }));
  }

  sendAutocompleteClick (result, resultType) {
    this.sendMessage('autocomplete-url-clicked', {
      result: result,
      resultType: resultType
    });
  }

  sendUrlSelected (result, resultType) {
    this.sendMessage('url-selected', {
      result: result,
      resultType: resultType
    });
  }

  sendAdjustHeight (newHeight) {
    this.sendMessage('adjust-height', {
      height: newHeight
    });
  }

  _messageReceived (e) {
    const newChannelId = e.detail.id;
    if (this.channelId !== newChannelId) {
      this.channelId = newChannelId;
    }

    const message = e.detail.message;
    if (message && message.type) {
      this.trigger(message.type, message.data);
    }
  }
}

export default new WebChannel();
