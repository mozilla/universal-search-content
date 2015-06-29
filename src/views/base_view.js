import AmpersandView from 'ampersand-view';

export default AmpersandView.extend({
  render () {
    this.beforeRender();

    AmpersandView.prototype.render.apply(this, arguments);

    this.afterRender();
  },

  // implement in submodules
  beforeRender () {},

  // implement in submodules
  afterRender () {}
});
