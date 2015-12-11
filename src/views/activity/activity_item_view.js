import BaseView from '../base_view';
import ActivityItemView from '../../templates/activity/item.html';
import Favicon from '../../lib/image_colors';
import webChannel from '../../lib/web_channel';

export default BaseView.extend({
  template: ActivityItemView,

  events: {
    'mousedown': 'openUrl',
    'select': 'sendSelectionDetails'
  },

  afterRender () {
    this.iconContainer = this.query('.icon.favicon');
    this.injectFavicon();
  },

  openUrl (event) {
    // we have to use mousedown, not click, because of browser bugs.
    // see https://github.com/mozilla/universal-search-addon/issues/20 for more.
    if (event.which === 1) {
      const prefix = this.model.type === 'action' ? 'moz-action:switchtab,' : '';
      webChannel.sendAutocompleteClick(prefix + this.model.url, 'url');
    }
  },

  sendSelectionDetails (event) {
    webChannel.sendUrlSelected(this.model.url, 'url');
  },

  injectFavicon () {
    // Manually construct the favicon element and inject it into the DOM,
    // allowing us to handle events directly, since load events don't bubble
    // and cannot be delegated.
    this.icon = new Image('img');
    this.icon.onload = () => {
      // if we have the fancy image, show it under the favicon. otherwise, do the bkgd color thing
      if (this.model.fancyImageData) {
        this.iconContainer.style.cssText =
          'background-size: cover; background-image: url("' + this.model.fancyImageData + '");';
      } else {
        this.calculateIconColor();
      }
    };
    this.icon.onerror = () => { this.hideErroredFavicon(); };
    this.icon.src = this.model.displayImage();
    this.iconContainer.appendChild(this.icon);
  },

  hideErroredFavicon () {
    this.icon.style.display = 'none';
  },

  calculateIconColor () {
    // If able to do so in 20ms or less, calculate the dominant color of the
    // favicon and set that to the background color of its parent.
    const START = performance.now();
    const favicon = new Favicon(this.icon);
    const END = performance.now();
    if (favicon.dominantColor && END - START < 20) {
      this.iconContainer.style.backgroundColor = favicon.dominantColor;
    }
  }
});
