import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {Category} from '../../shared/models/category.model';

@Component({
  selector: 'wfm-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit {

  @Output() onFilterCancel = new EventEmitter<any>();
  @Output() onFilterApply = new EventEmitter<any>();

  @Input() categories: Category[] = [];

  selectedPeriod;
  selectedTypes = [];
  selectedCategories = [];

  isLoaded = false;

  checkedTypes = {
    'income': true,
    'outcome': true,
  };
  checkedCategories = {};

  filtered;

  timePeriods = [
    {type: 'd', label: 'День'},
    {type: 'w', label: 'Тиждень'},
    {type: 'M', label: 'Місяць'}
  ];

  types = [
    {type: 'outcome', label: 'Витрати'},
    {type: 'income', label: 'Дохід'}
  ];

  ngOnInit() {
    this.filtered = JSON.parse(window.localStorage.getItem('filter'));
    if(this.filtered){
      this.resetChecked(false);
      this.filtered.categories.forEach((el) => {
        this.checkedCategories[el] = true;
      });
      this.filtered.types.forEach((el) => {
        this.checkedTypes[el] = true;
      });
      this.selectedPeriod = this.filtered.period;
    } else {
      this.resetChecked(true);
    }


    this.isLoaded = true;
  }

  private resetChecked(bool: boolean){
    this.categories.forEach((c) => {
      this.checkedCategories[c.id] = bool;
    });
    this.checkedTypes = {
      'income': bool,
      'outcome': bool,
    };
    this.selectedPeriod = 'M';
  }

  closeFilter() {
    this.onFilterCancel.emit();
  }

  applyFilter() {
    this.selectedTypes = [];
    for (const key in this.checkedTypes) {
      this.checkedTypes[key] ? this.selectedTypes.push(key) : null;
    }
    this.selectedCategories = [];
    for (const key in this.checkedCategories) {
      this.checkedCategories[key] ? this.selectedCategories.push(key) : null;
    }

    const historyFilterData = {
      types: this.selectedTypes,
      categories: this.selectedCategories,
      period: this.selectedPeriod
    };

    this.onFilterApply.emit(historyFilterData);

    window.localStorage.setItem('filter', JSON.stringify(historyFilterData));
  }



}
