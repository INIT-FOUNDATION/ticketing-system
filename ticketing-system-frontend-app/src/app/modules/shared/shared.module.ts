import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { NgModule } from '@angular/core';

/*------------- Common Module ------------------------*/
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';
/*------------- Common Module ------------------------*/

/*------------ Material Imports ---------------------*/
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/*------------ Material Imports ---------------------*/

/*------------ Directive Imports ---------------------*/
import { IntegerInputDirective } from './directives/input-integer.directive';
import { InputTrimDirective } from './directives/input-trim.directive';
import { MaxDirective } from './directives/max.directive';
import { MinDirective } from './directives/min.directive';
import { RangeLengthDirective } from './directives/range-length.directive';
import { RangeDirective } from './directives/range.directive';
/*------------ Directive Imports ---------------------*/

/*------------ Pipe Imports ---------------------*/
import { GenderPipe } from './pipes/gender.pipe';
/*------------ Pipe Imports ---------------------*/

/*------------ Components Imports ---------------------*/
import { LoaderComponent } from './components/loader/loader.component';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HeaderComponent } from 'src/app/screens/home/header/header.component';
/*------------ Components Imports ---------------------*/

const common_cmponents = [
  LoaderComponent,
  HeaderComponent,
];

const common_modules = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  NgxSpinnerModule,
  ImageCropperModule,
];

const material_modules = [
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatMenuModule,
  MatIconModule,
  MatTooltipModule,
];

const directives = [
  IntegerInputDirective,
  MaxDirective,
  InputTrimDirective,
  MinDirective,
  RangeLengthDirective,
  RangeDirective,
];

const pipes = [
  GenderPipe,
];

@NgModule({
  declarations: [...directives, ...pipes, ...common_cmponents],
  imports: [...common_modules, ...material_modules],
  exports: [
    ...common_modules,
    ...material_modules,
    ...directives,
    ...pipes,
    ...common_cmponents,
  ],
  providers: [AppPreferences, Camera, File, FileOpener],
})
export class SharedModule {}
