import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/modules/shared/services/location.service';
import * as moment from 'moment';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { MatDialog } from '@angular/material/dialog';
import { UploadDocumentComponent } from 'src/app/modules/shared/components/upload-document/upload-document.component';
import {v4 as uuidv4} from 'uuid';
import { forkJoin, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  @Input() formType = 'add';
  formSubmitted = false;
  ticketForm: FormGroup;
  ticket_mode = [
    {id: 1, label: 'Self'},
    {id: 2, label: 'By Auditor'},
  ];
  blockList;
  ticket_id;
  documentcols: Colmodel[] = [];
  visitscols: Colmodel[] = [];
  rowsPerPage = 50;
  rows = [
    {value: 5, label: '5'},
    {value: 10, label: '10'},
    {value: 15, label: '15'},
    {value: 20, label: '20'},
  ];
  @ViewChild("documentsGrid") documentsGrid: CommonDataTableComponent;
  @ViewChild("visitsGrid") visitsGrid: CommonDataTableComponent;
  documents: {document_id: string, form_data: FormData }[] = [];
  visitsData: any[] = [];
  constructor(private ticketService: TicketService,
              private utilsService: UtilsService,
              private router: Router,
              private locationService: LocationService,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initForm();
    this.prepareDocumentsGridCols();
    this.prepareVisitsGridCols();

    if (this.formType == 'edit') {
      this.ticket_id = this.activatedRoute.snapshot.params.ticket_id;

      if (this.ticket_id) {
        this.getTicket();
      } else {
        this.back();
      }
    }
  }

  prepareDocumentsGridCols() {
    this.documentcols = [
      new Colmodel('document_id', 'Document ID', false, false, true),
      new Colmodel('file_name', 'File Name', false, false, false),
      new Colmodel('document_type', 'Document Type', false, false, false),
      new Colmodel('date_created', 'Date of Upload', false, false, false),
      new Colmodel('unsaved', 'Unsaved', false, false, true)
    ];
  }

  prepareVisitsGridCols() {
    this.visitscols = [
      new Colmodel('visit_id', 'Visit ID', false, false, true),
      new Colmodel('visit_no', 'Visit No', false, false, false),
      new Colmodel('visit_type', 'Visit Type', false, false, false),
      new Colmodel('visit_by', 'Visited By', false, false, false),
      new Colmodel('remarks', 'Remarks', false, false, false),
      new Colmodel('visit_date', 'Visited Date', false, false, true)
    ];
  }

  async getTicket() {
    forkJoin({
      ticket: this.ticketService.getTicket({ticket_id: this.ticket_id}),
      visits: this.ticketService.getAllVisits({ticket_id: this.ticket_id}),
    }).subscribe(async (res: any) => {
      let ticketDetails;
      if (res.ticket) {
        ticketDetails = res.ticket;
        this.ticketForm.patchValue({
          ticket_id: ticketDetails.ticket_id,
          ticket_no: ticketDetails.ticket_number,
          ticket_mode: ticketDetails.ticket_mode,
          ticket_raised_date: ticketDetails.ticket_mode,
          product_id: ticketDetails.product_id,
          product_serial_no: ticketDetails.serial_number,
          product_model_number: ticketDetails.model_number,
          product_hw_name: ticketDetails.product_name,
          product_brand_name: ticketDetails.product_name,
          product_installation_date: moment(ticketDetails.installation_date).format('DD-MM-YYYY'),
          vendor_id: ticketDetails.vendor_id,
          vendor_name: ticketDetails.vendor_name,
          vendor_contact_person_name: ticketDetails.vendor_contact_name,
          vendor_contact_no: ticketDetails.vendor_contact_number,
          vendor_email_id: ticketDetails.email_id,
          site_id: ticketDetails.site_id,
          site_name: ticketDetails.state_name,
          site_udise_code: ticketDetails.site_code,
          site_state_id: ticketDetails.state_id,
          site_district_id: ticketDetails.district_id,
          site_block_id: ticketDetails.block_id,
          site_block_name: ticketDetails.block_name,
          site_address: ticketDetails.address,
          site_contact_person_name: ticketDetails.primary_contact_name,
          site_contact_no: ticketDetails.primary_contact_number,
          issue_description: ticketDetails.description,
          issue_remarks: ticketDetails.remarks
        });
        this.getBlocks(ticketDetails.district_id);


        if (ticketDetails.documents && ticketDetails.documents.length > 0) {
          for(let doc of ticketDetails.documents) {
            let blob: any = await this.ticketService.downloadDocument({doc_id: doc.doc_id}).toPromise();
            blob = (blob as Blob);
            let [type, ext] = blob.type.split('/')
            let fileObj = new File([blob], `${doc.doc_title}.${ext}`, {type: blob.type});
            let formData = new FormData();
            formData.append('file_name', doc.doc_title);
            formData.append('file', fileObj);
            formData.append('date_created', doc.date_created);
            this.documents.push({document_id: doc.doc_id, form_data: formData});
          }
          this.prepareRemoteGridData();
        }

        this.ticketForm.get('product_serial_no').disable();
      }

      if (res.visits && res.visits.length > 0) {
        res.visits.forEach((visit, index) => {
          visit.visit_no = `${this.ordinal_suffix_of((index+1))} Visit`
        })
        this.visitsData = res.visits;
      }
    })
  }

  ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
 }

  initForm() {
    this.ticketForm = new FormGroup({
      ticket_id: new FormControl(null),
      ticket_no: new FormControl(null),
      ticket_mode: new FormControl(null, [Validators.required]),
      ticket_raised_date: new FormControl(moment().toISOString()),
      product_id: new FormControl(null, [Validators.required]),
      product_hw_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      product_serial_no: new FormControl(null, [Validators.required]),
      product_model_number: new FormControl({value:null, disabled: true}, [Validators.required]),
      product_brand_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      product_installation_date: new FormControl({value:null, disabled: true}, [Validators.required]),
      vendor_id: new FormControl({value:null, disabled: true}, [Validators.required]),
      vendor_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      vendor_contact_person_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      vendor_contact_no: new FormControl({value:null, disabled: true}, [Validators.required]),
      vendor_email_id: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_id: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_udise_code: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_state_id: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_district_id: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_block_id: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_block_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_address: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_contact_person_name: new FormControl({value:null, disabled: true}, [Validators.required]),
      site_contact_no: new FormControl({value:null, disabled: true}, [Validators.required]),
      issue_description: new FormControl(null, [Validators.required]),
      issue_remarks: new FormControl(null, [Validators.required])
    });
  }

  getBlocks(district_id) {
    this.locationService.getBlocks(district_id).subscribe(res => {
      this.blockList = res;
    })
  }


  getProductDetails() {
    let serialNo = this.ticketForm.get('product_serial_no').value;
    if (serialNo) {
      let payload = {
        serial_number: serialNo
      }
      this.ticketService.getProduct(payload).subscribe((res: any) => {
        let productDetails;
        if (res && res.length > 0) {
          productDetails = res[0];
          this.ticketForm.patchValue({
            product_id: productDetails.product_id,
            product_model_number: productDetails.model_number,
            product_hw_name: productDetails.product_name,
            product_brand_name: productDetails.product_name,
            product_installation_date: moment(productDetails.installation_date).format('DD-MM-YYYY'),
            vendor_id: productDetails.vendor_id,
            vendor_name: productDetails.vendor_name,
            vendor_contact_person_name: productDetails.vendor_contact_name,
            vendor_contact_no: productDetails.vendor_contact_number,
            vendor_email_id: productDetails.email_id,
            site_id: productDetails.site_id,
            site_name: productDetails.state_name,
            site_udise_code: productDetails.site_code,
            site_state_id: productDetails.state_id,
            site_district_id: productDetails.district_id,
            site_block_id: productDetails.block_id,
            site_block_name: productDetails.block_name,
            site_address: productDetails.address,
            site_contact_person_name: productDetails.primary_contact_name,
            site_contact_no: productDetails.primary_contact_number
          });

          this.getBlocks(productDetails.district_id);
        }
      })
    }
  }

  submit() {
    this.formSubmitted = true;
    if (this.ticketForm.valid) {
      let formData = this.ticketForm.getRawValue();
      let payload = {
        ticket_mode: formData.ticket_mode,
        product_id: formData.product_id,
        description: formData.issue_description,
        opening_date: formData.ticket_raised_date,
        remarks: formData.issue_remarks
      }
      if (this.documents.length > 0) {
        let formData = new FormData();
        formData.append('ticket_mode', payload.ticket_mode);
        formData.append('product_id', payload.product_id);
        formData.append('description', payload.description);
        formData.append('opening_date', payload.opening_date);
        formData.append('remarks', payload.remarks);
        for (let doc of this.documents) {
          let file = (doc.form_data.get('file') as File);
          let name = file.name;
          let actualName = doc.form_data.get('file_name');
          let ext = name.split('.')[1];
          let filename = `${actualName}.${ext}`;
          formData.append('doc_files', file, filename);
        }

        this.ticketService.createTicket(formData).subscribe(res => {
          this.utilsService.showSuccessToast('Ticket has been raised successfully');
          this.back();
        })
      } else {
        this.utilsService.showErrorToast('Please upload documents');
      }
    }
  }

  uploadDocumentDialog() {
    const dialogRef = this.dialog.open(UploadDocumentComponent,
      {
        data: {
        },
        width: '40%',
        height:'520px',
        disableClose: true,
        panelClass: 'my-dialog'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.savedData) {
        let documentId = uuidv4();
        this.documents.push({document_id: documentId, form_data: (result.savedData as FormData)});
        // this.getPatientDocuments();
        this.prepareLocalGridData();
      }
    });
  }

  prepareLocalGridData() {
    this.documentsGrid.data = [];
    this.documents.forEach(data => {
      let file = (data.form_data.get('file') as File);
      let document_type = this.getDocumentType(file.type);
      this.documentsGrid.data.push({
        document_id: data.document_id,
        file_name: data.form_data.get('file_name'),
        date_created: moment().format('DD-MM-YYYY'),
        document_type: document_type,
        unsaved: true,
      });
    })
  }


  getDocumentType(type: string) {
    let document_type = ''
    if (type.indexOf('image/') != -1) {
      document_type = 'Image';
    } else if (type.indexOf('application/pdf') != -1) {
      document_type = 'PDF';
    }
    return document_type;
  }

  prepareRemoteGridData() {
    this.documentsGrid.data = [];
    this.documents.forEach(data => {
      let file = (data.form_data.get('file') as File);
      let document_type = this.getDocumentType(file.type);
      this.documentsGrid.data.push({
        document_id: data.document_id,
        file_name: data.form_data.get('file_name'),
        date_created: moment((data.form_data.get('date_created') as string)).format('DD-MM-YYYY'),
        document_type: document_type,
        unsaved: false,
      });
    })
  }

  downloadDocument(gridData) {
    let filename
    let formData = (this.documents.find(doc => doc.document_id == gridData.document_id).form_data);
    let file = (formData.get('file') as File);
    let name = file.name;
    let ext = name.split('.')[1];
    filename = `${gridData.file_name}.${ext}`;
    const blob: any = new Blob([file], { type: file.type });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  removeDocument(gridData) {
    let document_id = gridData.document_id;
    this.documents = this.documents.filter(data => data.document_id != document_id);
    this.prepareLocalGridData();
  }

  back() {
    this.router.navigate(['/tickets']);
  }

}
