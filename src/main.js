import app from 'ampersand-app';
import IndexView from './views/index_view';
import './styles/main.scss';

app.extend({
  initialize () {
    // this isn't the right place to start timing boot but we'll go with it for now
    console.time('boot');

    this.renderIndexView();

    console.timeEnd('boot');
  },

  renderIndexView () {
    this.indexView = new IndexView();

    document.body.appendChild(this.indexView.render().el);
  }
});

app.initialize();
