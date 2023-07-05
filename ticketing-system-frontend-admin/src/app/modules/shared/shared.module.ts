import { AadharNumberDirective } from './directives/aadhar-number.directive';
import { AadhaarNumberValidationDirective } from './directives/aadhaar-validation.directive';
import { FourNumberDirective } from './directives/four-number.directive';
import { AgeNumberDirective } from './directives/age-number.directive';
import { OtpNumberDirective } from './directives/otp-number.directive';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DialogModule} from 'primeng/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MinDirective } from './directives/min.directive';
import { MaxDirective } from './directives/max.directive';
import { RangeLengthDirective } from './directives/range-length.directive';
import { RangeDirective } from './directives/range.directive';
import { InputCharDirective } from './directives/input-char.directive';
import { MobileNumberDirective } from './directives/mobile-number.directive';
import { ZeroNotallowedDirective } from './directives/zero-notallowed.directive';
import { IntegerInputDirective } from './directives/input-integer.directive';
import { InputTrimDirective } from './directives/input-trim.directive';
import { OnlynumberDirective } from './directives/numbersOnly.directive';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NegativezeroNotallowedDirective } from './directives/negativezero-notallowed.directive';
import {MatTableModule} from '@angular/material/table';
import { TitleCaseCustomPipe } from './pipes/title-case-custom.pipe';
import { AgeRangeDirective } from './directives/age-range.directive';
import { TableModule } from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CardModule} from 'primeng/card';
import {CalendarModule} from 'primeng/calendar';
import {AccordionModule} from 'primeng/accordion';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import {ClipboardModule} from '@angular/cdk/clipboard';

import {DataViewModule} from 'primeng/dataview';
import { CommonDataViewComponent } from '../common-data-view/common-data-view.component';
import { ToastrModule } from 'ngx-toastr';
import {RatingModule} from 'primeng/rating';
import {BadgeModule} from 'primeng/badge';
import { CommonDataTableModule } from '../common-data-table/common-data-table.module';
import {PopoverModule} from "ngx-smart-popover";
/*Full Calendar*/
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { CcDurationPipePipe } from './pipes/cc-duration-pipe.pipe';
import {ContextMenuModule} from 'primeng/contextmenu';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DndDirective } from './directives/dnd.directive';



import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { WardNamePipePipe } from './pipes/ward-name-pipe.pipe';

import { SpecialityNamePipe } from './pipes/speciality-name-pipe.pipe';
import { LanguageNamePipe } from './pipes/languages-name.pipe';
import { ImageCropperModule } from "ngx-image-cropper";
import { CommonImageUploadComponent } from './components/common-image-upload/common-image-upload.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TranslationPrescriptionPipe } from './pipes/translation-prescription.pipe'


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

/*Full Calendar*/

const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const exportComponents = [
  HeaderComponent,
  FooterComponent,
  LoaderComponent,
  SideBarComponent,
  CommonDataViewComponent,
  ProgressBarComponent,
 
  CommonImageUploadComponent
];

const exportDirectives = [
  InputCharDirective,
  RangeDirective,
  RangeLengthDirective,
  MaxDirective,
  MinDirective,
  MobileNumberDirective,
  ZeroNotallowedDirective,
  InputTrimDirective,
  OnlynumberDirective,
  IntegerInputDirective,
  NegativezeroNotallowedDirective,
  OtpNumberDirective,
  AgeNumberDirective,
  FourNumberDirective,
  AadhaarNumberValidationDirective,
  AadharNumberDirective,
  AgeRangeDirective,
  DndDirective
];

const exportPipes = [
  TitleCaseCustomPipe,
  CcDurationPipePipe,
  WardNamePipePipe,
  SpecialityNamePipe,
  LanguageNamePipe,
  TranslationPrescriptionPipe
];


const exportModules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatExpansionModule,
  MatChipsModule,
  MatCardModule,
  MatTreeModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
  DropdownModule,
  MultiSelectModule,
  ButtonModule,
  MenuModule,
  RippleModule,
  RadioButtonModule,
  CardModule,
  TableModule,
  CalendarModule,
  AccordionModule,
  DynamicDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  DialogModule,
  NgxSpinnerModule,
  MatMenuModule,
  DataViewModule,
  RatingModule,
  BadgeModule,
  CommonDataTableModule,
  MatMomentDateModule,
  FullCalendarModule,
  MatDialogModule,
  MatTabsModule,
  ContextMenuModule,
  PopoverModule,
  NgxMatSelectSearchModule,
  ImageCropperModule,
  MatSlideToggleModule,
  ClipboardModule
];
@NgModule({
  declarations: [
    ...exportComponents,
    ...exportDirectives,
    ...exportPipes,
   
  ],
  imports: [
    ...exportModules,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(),

  ],
  exports: [
    ...exportComponents,
    ...exportDirectives,
    ...exportPipes,
    ...exportModules,
    ToastrModule,
    NgxMaskModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class SharedModule {
  constructor() {}
}
