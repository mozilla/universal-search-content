import AmpersandView from 'ampersand-view';
import dom from 'ampersand-dom';

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

  show () {
    dom.show(this.el);
  },

  hide () {
    dom.hide(this.el);
  }
});
