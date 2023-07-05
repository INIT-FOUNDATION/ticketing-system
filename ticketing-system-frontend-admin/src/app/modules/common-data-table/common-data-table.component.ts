import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FilterService, OverlayService, PrimeNGConfig } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { Table, TableHeaderCheckbox, TableService } from 'primeng/table';
import { Colmodel, HeaderColModel } from './model/colmodel.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-common-data-table',
  templateUrl: './common-data-table.component.html',
  styleUrls: ['./common-data-table.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonDataTableComponent),
      multi: true
    }, DomHandler, TableService, OverlayService, Table]
})
export class CommonDataTableComponent extends Table implements OnInit {
  @ViewChild('dt') private primengTable: Table;
  @Input() pagination = true;
  @Input() loadUrl = '/api/searchservice/loadComponentData';
  @Input() colModel: Colmodel[];
  @Input() headerModel: HeaderColModel[];
  @Input() gridId: string;
  @Input() sField?: string = null;
  @Input() sOrder?: string = null;
  @Input() selectType = 'single';
  @Input() additionalParams: Object;
  @Input() paginationpos = 'bottom';
  @Input() idColumn?: string;
  @Input() selectedRowsFromParentComponent = new Array();
  @Input() localData: [];
  @Input() lazyLoad = true;
  @Input() rowsPerPage = 50;
  @Input() noFilter = false;
  @Input() defaultFilterMetadata = null;
  @Input() showGroupedHeader = false;
  @Input() checkboxHeaderText?: string = null;
  @Input() actionColumnRequired = true;
  @Input() actionColumnTemplate: TemplateRef<any> = null;
  @Output() onCustomrowSelect = new EventEmitter<{ data: any, index: any, originalEvent: MouseEvent, type: string }>();
  @Output() onCustomrowunselect = new EventEmitter<{ data: any, index: any, originalEvent: MouseEvent, type: string }>();
  @Output() onSelectAllRows = new EventEmitter<{ affectedRows: any, checked: any, originalEvent: MouseEvent }>();
  @Output() onCustomPageChangeEvent = new EventEmitter<{ currentPage: number, pageSize: number }>();
  @Output() onCustomPageAndFilterEvent = new EventEmitter<any>();
  @Output() onCustomFilterEvent = new EventEmitter<any>();
  defaultvaluesObj = new Object();
  isShowSelected = false;
  headerCheckbox = false;
  lazyloadFired = false;
  selectedRows: any[];
  sortOrderPrimeNgForm: number;


  currentPage: number;

  data: any[];

  totalNotHiddenColumns = 0;
  isPageChanged = false;
  reloagGridTrue = false;
  filterParams: any;
  constructor(el: ElementRef,
              zone: NgZone,
              tableService: TableService,
              cd: ChangeDetectorRef,
              dt: Table,
              filterService: FilterService,
              overlayService: OverlayService,
              private primeConfig: PrimeNGConfig) {
    super(el, zone, tableService, cd, filterService, overlayService);
  }

  override ngOnInit() {
    this.primeConfig.ripple = true;
    this.data = this.localData;
  }

  onCustomPageChange(event) {
    if (event.first === 0) {
      this.currentPage = 1;
    } else {
      // tslint:disable-next-line: radix
      this.currentPage = (event.first / parseInt('' + event.rows)) + 1;
    }
    this.onCustomPageAndFilterEvent.emit(event);
  }

  customizingTiggleRowsGrid() {
    this.primengTable.toggleRowsWithCheckbox = (event, check) => {
      let selection = [];
      if (!check) {
        selection = this.primengTable.value.slice();
        selection = selection.filter(this.isEditableCheckbox);
        _.each(selection, (row) => {
          const match = {}; match[this.primengTable.dataKey] = row[this.primengTable.dataKey];
          _.remove(this.primengTable._selection, match);
        });
      } else {
        // tslint:disable-next-line: max-line-length
        selection = check ? this.primengTable.filteredValue ? this.primengTable.filteredValue.slice() : this.primengTable.value.slice() : [];
        selection = selection.filter(this.isEditableCheckbox);
        _.each(this.primengTable._selection, (row) => {
          const match = {}; match[this.primengTable.dataKey] = row[this.primengTable.dataKey];
          _.remove(selection, match);
        });

        if (!this.primengTable._selection) {
          this.primengTable._selection = [];
        }
        this.primengTable._selection = this.primengTable._selection.concat(selection);
      }

      this.primengTable.preventSelectionSetterPropagation = true;
      this.primengTable.updateSelectionKeys();
      this.primengTable.selectionChange.emit(this.primengTable._selection);
      this.primengTable.tableService.onSelectionChange();
      this.primengTable.onHeaderCheckboxToggle.emit({
        originalEvent: event,
        affectedRows: selection,
        checked: check
      });
    };
  }

  isEditableCheckbox(element: any, index: any, array: any) {
    if (element.editable !== undefined) {
      return element.editable;
    } else {
      return true;
    }
  }

  onCustomRowSelect(event: { data: any, index: any, originalEvent: MouseEvent, type: string }) {
    this.onCustomrowSelect.emit(event.data);
  }

  onCustomRowUnselect(event: { data: any, index: any, originalEvent: MouseEvent, type: string }) {
    this.onCustomrowunselect.emit(event.data);
  }

  onSelectAllEvent(event: { affectedRows: [], checked: boolean, originalEvent: MouseEvent }) {
    if (!this.headerCheckbox) {
      this.onSelectAllRows.emit(event);
      this.headerCheckbox = true;
    } else {
      this.onSelectAllRows.emit(event);
      this.headerCheckbox = false;
    }
  }


  loadDataTOGrid(requestBody) {
    console.log(requestBody);
    // this.onCustomPageAndFilterEvent.emit(requestBody);
  }

  showSelected(isChecked: boolean) {
    this.isShowSelected = isChecked;
  }

  get getTotalVisibleColumns(): number {
    let visibleColumns = 0;
    if (this.selectType !== 'none') {
      visibleColumns += 1;
    }

    _.each(this.colModel, (col: Colmodel) => {
      if (col.hidden === undefined) {
        visibleColumns += 1;
      } else if (!col.hidden) {
        visibleColumns += 1;
      }
    });

    if (this.actionColumnRequired) {
      visibleColumns += 1;
    }

    return visibleColumns;
  }

  customExportCSV() {
    this.primengTable.exportCSV();
  }

  filterData(payload: any, newData: any) {
    let filterData = false;
    if (payload.filters) {
      Object.entries(payload.filters).forEach(([key, value]) => {
        let filter = value[0];
        if (filter.value) {
          filterData = true;
          return false;
        }
      });
    }

    let filteredData: any = [...newData];
    if (filterData) {
      Object.entries(payload.filters).forEach(([key, value]) => {
        let filter = value[0];
        if (filter.value) {
          switch (filter.matchMode) {
            case 'contains':
              filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().indexOf(filter.value.toLowerCase()) != -1);
              break;
            case 'equals':
              filteredData = filteredData.filter(obj => obj[key]?.toLowerCase() == filter.value.toLowerCase());
              break;
            case 'notEquals':
              filteredData = filteredData.filter(obj => obj[key]?.toLowerCase() != filter.value.toLowerCase());
              break;
            case 'notContains':
              filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().indexOf(filter.value.toLowerCase()) == -1);
              break;
            case 'startsWith':
              filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().startsWith(filter.value.toLowerCase()));
              break;
            case 'endsWith':
              filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().endsWith(filter.value.toLowerCase()));
              break;
          }
        }
      });
    }
    return filteredData;
  }

  onCustomFilter(payload, data) {
    console.log(payload);
    let filterData = false;
    if (payload.filters) {
      Object.entries(payload.filters).forEach(([key, value]) => {
        if (key != 'global') {
          let filter = value[0];
          if (filter.value) {
            filterData = true;
            return false;
          }
        }
      });
    }

    let filteredData: any = [...data]
    if (filterData) {
      Object.entries(payload.filters).forEach(([key, value]) => {
        if (key != 'global') {
          let filter = value[0];
          if (filter.value) {
            switch (filter.matchMode) {
              case 'contains':
                filteredData = filteredData.filter(obj => {
                  if(obj[key]){
                  if (parseInt(obj[key]) == NaN) {
                      return obj[key]?.indexOf(filter.value) != -1;
                    }
                    else {
                      return obj[key]?.toString().toLowerCase().indexOf(filter.value?.toLowerCase()) != -1;
                    }
                  }

                });
                break;
              case 'equals':
                filteredData = filteredData.filter(obj =>{
                  if(obj[key]){
                    if (parseInt(obj[key]) == NaN) {
                      return obj[key] == filter.value
                    }
                    else{
                      return obj[key]?.toLowerCase() == filter.value?.toLowerCase()
                    }
                  }

                })

                break;
              case 'notEquals':
                filteredData = filteredData.filter(obj => {
                  if(obj[key]){
                    if (parseInt(obj[key]) == NaN) {
                      return obj[key] != filter.value
                    }
                    else{
                      return obj[key]?.toLowerCase() != filter.value?.toLowerCase()
                    }
                  }
                } );
                break;
              case 'notContains':
                filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().indexOf(filter.value.toLowerCase()) == -1);
                break;
              case 'startsWith':
                filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().startsWith(filter.value.toLowerCase()));
                break;
              case 'endsWith':
                filteredData = filteredData.filter(obj => obj[key]?.toLowerCase().endsWith(filter.value.toLowerCase()));
                break;
              case 'gt':
                filteredData = filteredData.filter(obj => obj[key] > filter.value);
                break;
              case 'gte':
                filteredData = filteredData.filter(obj => obj[key] >= filter.value);
                break;
                case 'lt':
                filteredData = filteredData.filter(obj => obj[key] < filter.value);
                break;
              case 'lte':
                filteredData = filteredData.filter(obj => obj[key] <= filter.value);
                break;
              case 'in':
                if (filter.value.length > 0) {
                  let filteredValues = filter.value.map(item => item.value.toLowerCase());
                  filteredData = filteredData.filter(obj => filteredValues.indexOf(obj[key]?.toLowerCase()) > -1);
                }
                break;
            }
          }
        }
      });
    }
    if (payload.globalFilter) {
      let globalFilterFields = this.primengTable.globalFilterFields;
      let globalFiteredData = [];
      globalFilterFields.forEach(field => {
        let globalFilter = [...filteredData]
        globalFilter = globalFilter.filter(obj => {
          if (typeof (obj[field]) == 'string') {
            return obj[field]?.toLowerCase().indexOf(payload.globalFilter.toLowerCase()) != -1
          } else if (typeof (obj[field]) == 'object') {
            let data = obj[field].join(',');
            return data?.toLowerCase().indexOf(payload.globalFilter.toLowerCase()) != -1
          }
        });
        globalFiteredData.push(...globalFilter);
      });
      var unique = [...new Set(globalFiteredData.map(item => item))];
      filteredData = unique;
    }


    if (this.primengTable) {
      this.primengTable.value = filteredData;
    }
    this.onCustomFilterEvent.emit({ data: filteredData, length: filterData ? true : false, filterDataType: this.primengTable.dataKey })
    // this.primengTable.totalRecords = filteredData.length
  }

}
