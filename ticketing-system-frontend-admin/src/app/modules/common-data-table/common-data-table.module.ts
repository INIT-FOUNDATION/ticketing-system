import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataTableComponent } from './common-data-table.component';
import { TableModule } from 'primeng/table';

import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';


@NgModule({
  declarations: [
    CommonDataTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    MultiSelectModule
  ],
  exports: [CommonDataTableComponent]
})
export class CommonDataTableModule { }
