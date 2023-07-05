import { Component, OnInit, forwardRef, ElementRef, ChangeDetectorRef, ViewChild, Input, TemplateRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FilterService, PrimeNGConfig } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { DomHandler } from 'primeng/dom';

@Component({
  selector: 'app-common-data-view',
  templateUrl: './common-data-view.component.html',
  styleUrls: ['./common-data-view.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonDataViewComponent),
      multi: true
    }, DomHandler, FilterService, DataView]
})
export class CommonDataViewComponent extends DataView implements OnInit {

  @ViewChild('dv') public dataViewTable: DataView;
  @Input() pagination = true;
  @Input() gridId: string;
  @Input() sField?: string = null;
  @Input() sOrder?: string = null;
  @Input() paginationpos = 'bottom';
  @Input() idColumn?: string;
  @Input() localData: [];
  @Input() lazyLoad = true;
  @Input() rowsPerPage = 50;
  @Input() scrollable = false;
  @Input() scrollHeight = '300px';
  @Input() noFilter = false;
  @Input() defaultFilterMetadata = null;
  @Input() showGroupedHeader = false;
  @Input() checkboxHeaderText?: string = null;
  @Input() listViewItem;
  @Input() gridViewItem;
  @Input() headerItem;
  @Input() filterByList = 'name';
  currentPage: number;

  data: any[];
  totalNotHiddenColumns = 0;
  isPageChanged = false;
  reloagGridTrue = false;
  filterParams: any;

  sortOptions = [
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' },
  ];
  @Output() onCustomPageChangeEvent = new EventEmitter<{ currentPage: number, pageSize: number }>();

  constructor(el: ElementRef,
              cd: ChangeDetectorRef,
              filterService: FilterService,
              config: PrimeNGConfig) {
    super(el, cd, filterService, config);
  }

  override ngOnInit() {
    this.data = this.localData;
    this.config.ripple = true;
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onCustomPageChange(event) {
    if (event.first === 0) {
      this.currentPage = 1;
    } else {
      // tslint:disable-next-line: radix
      this.currentPage = (event.first / parseInt('' + event.rows)) + 1;
    }
    this.onCustomPageChangeEvent.emit({currentPage: this.currentPage, pageSize: event.rows})
  }

}
