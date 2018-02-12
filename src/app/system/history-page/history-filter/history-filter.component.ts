import {Component, EventEmitter, Output, Input} from '@angular/core';
import {Category} from "../../shared/models/category.model";

@Component({
  selector: 'wfm-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent {

  @Output() onFilterCancel = new EventEmitter<any>();
  @Output() onFilterApply = new EventEmitter<any>();

  @Input() categories: Category[] = [];

  selectedPeriod = 'd';
  selectedTypes = [];
  selectedCategories = [];

  timePeriods = [
    {type: 'd', label: 'День'},
    {type: 'w', label: 'Тиждень'},
    {type: 'M', label: 'Місяць'}
  ];

  types = [
    {type: 'income', label: 'Дохід'},
    {type: 'outcome', label: 'Витрати'}
  ];

  closeFilter() {
    this.selectedPeriod = 'd';
    this.selectedTypes = [];
    this.selectedCategories = [];
    this.onFilterCancel.emit();
  }

  private calculateInputParams(field: string, checked: boolean, value: string){
    if( checked) {
      this[field].indexOf(value) === -1 ? this[field].push(value): null;
    } else {
      this[field] = this[field].filter(i => i !== value);
    }
  }

  handleChangeType({checked, value}) {
    this.calculateInputParams('selectedTypes', checked, value);
  }

  handleChangeCategory({checked, value}) {
    this.calculateInputParams('selectedCategories', checked, value);
  }

  applyFilter() {
    this.onFilterApply.emit({
      types: this.selectedTypes,
      categories: this.selectedCategories,
      period: this.selectedPeriod
    });

    const historyFilterData = {
      types: this.selectedTypes,
      categories: this.selectedCategories,
      period: this.selectedPeriod
    };

    window.localStorage.setItem('filter', JSON.stringify(historyFilterData));
  }



}
