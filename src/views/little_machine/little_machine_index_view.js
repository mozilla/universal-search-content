import BaseView from '../base_view';
import LittleMachineIndexTemplate from '../../templates/little_machine/index.html';
import LittleMachineItemView from './little_machine_item_view';
import LittleMachineResults from '../../collections/little_machine_results';
import LittleMachineAdapter from '../../adapters/little_machine_adapter';

export default BaseView.extend({
  template: LittleMachineIndexTemplate,

  initialize () {
    this.little_machine = LittleMachineAdapter;
    this.listenTo(this.little_machine.results, 'reset', this.render);
  },

  afterRender () {
    this.removeSubviews();
    let items = this.sliceCollection(this.little_machine.results,
                                     LittleMachineResults, 0, 1);
    this.renderCollection(items, LittleMachineItemView,
                          '.little-machine-results');

    // if there are results then show otherwise hide
    this.little_machine.results.length ? this.show() : this.hide(); // eslint-disable-line no-unused-expressions
  }
});
