import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loading: boolean = false;
  constructor(
    private loaderService: LoaderService,
    private spinner: NgxSpinnerService,
  ) {

    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
      if (v) {
        this.spinner.show();
      }else{
        this.spinner.hide();
      }
    });
  }
  ngOnInit() {
  }

}
