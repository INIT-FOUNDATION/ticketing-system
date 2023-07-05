import { TemplateRef } from '@angular/core';

export enum GridFIlterType {
  INPUT = 'input',
  DROPDOWN = 'dropdown',
  DROPDOWNFILTERED = 'dropdownfiltered',
  MULTISELECT = 'multiselect',
  DATE = 'date',
  RANGESLIDER = 'range',
  NONE = 'none'
}

export interface OptionalParamsForGrid {
  filtertype?: GridFIlterType;
  auxillaryData?: {data: {label: string, value: any, icon?: string}[] | string};
  formatterTemplateRef?: TemplateRef<any>;
  align?: string;
  width?: string;
  defaultValue?: any;
}

export class Colmodel {
  constructor(public field: string,
              public header: string,
              public sortable = true,
              public filter = true,
              public hidden = false,
              public optionalParams?: OptionalParamsForGrid,
              public showToolTip: boolean = false,
              public colspan = '1',
              public rowspan = '1') {}
}

export class HeaderColModel {
  constructor(public headerName: string,
              public colspan = '1',
              public rowspan = '1') {}
}


