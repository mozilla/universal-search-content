import AmpersandView from 'ampersand-view';
import dom from 'ampersand-dom';
import flatten from 'lodash/array/flatten';
import invoke from 'lodash/collection/invoke';

export default AmpersandView.extend({
  render () {
    this.beforeRender();

    AmpersandView.prototype.render.apply(this, arguments);

    this.afterRender();
  },

  // implement in submodules
  beforeRender () {},

  // implement in submodules
  afterRender () {},

  // This really seems like it should be a built-in function in ampersand-view, but it isn't:
  // https://github.com/AmpersandJS/ampersand-view/blob/5c4192545c80d1682ba47f339306c66c00a8819c/ampersand-view.js#L168
  removeSubviews () {
    if (this._subviews) {
      invoke(flatten(this._subviews), 'remove');
    }
  },

  show () {
    dom.show(this.el);
  },

  hide () {
    dom.hide(this.el);
  }
});
