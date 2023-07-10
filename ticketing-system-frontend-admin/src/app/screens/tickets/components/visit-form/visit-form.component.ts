import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { MatDialog } from '@angular/material/dialog';
import {v4 as uuidv4} from 'uuid';
import { UploadDocumentComponent } from 'src/app/modules/shared/components/upload-document/upload-document.component';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent implements OnInit {
  @Input() formType = 'add';
  formSubmitted = false;
  visit_type = [
    {label: 'Aieze member', value: 1},
    {label: 'Vendor\'s engineer', value: 2},
  ];
  visitForm: FormGroup;
  ticket_id;
  userDetails;
  documentcols: Colmodel[] = [];
  rowsPerPage = 50;
  rows = [
    {value: 5, label: '5'},
    {value: 10, label: '10'},
    {value: 15, label: '15'},
    {value: 20, label: '20'},
  ];
  @ViewChild("documentsGrid") documentsGrid: CommonDataTableComponent;
  documents: {document_id: string, form_data: FormData }[] = [];
  ticketDetails;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private ticketService: TicketService,
              private utilsService: UtilsService,
              private dataService: DataService,
              private dialog: MatDialog) {
    this.ticket_id = this.activatedRoute.snapshot.params.ticket_id;
    if (!this.ticket_id) {
      this.back()
    }
    this.userDetails = this.dataService.userDetails;
 }

  ngOnInit(): void {
    this.visitForm = new FormGroup({
      ticket_id: new FormControl(this.ticket_id, [Validators.required]),
      visit_type: new FormControl(1, [Validators.required]),
      visit_by: new FormControl({value: this.userDetails.display_name, disabled: true}, [Validators.required]),
      remarks: new FormControl(null, [Validators.required]),
      visit_date: new FormControl(moment().toISOString(), [Validators.required]),
    });

    this.prepareAppointmentGridCols();

    if (this.ticket_id) {
      this.getTicket();
    }
  }

  prepareAppointmentGridCols() {
    this.documentcols = [
      new Colmodel('document_id', 'Document ID', false, false, true),
      new Colmodel('file_name', 'File Name', false, false, false),
      new Colmodel('document_type', 'Document Type', false, false, false),
      new Colmodel('date_created', 'Date of Upload', false, false, false),
      new Colmodel('unsaved', 'Unsaved', false, false, true)
    ];
  }

  async getTicket() {
    this.ticketService.getTicket({ticket_id: this.ticket_id}).subscribe(async (res: any) => {
      if (res) {
        this.ticketDetails = res;
      }
    })
  }

  submit() {
    this.formSubmitted = true;
    if (this.visitForm.valid) {
      let a_formData = this.visitForm.getRawValue();
      if (this.documents.length > 0) {
        let formData = new FormData();
        formData.append('ticket_id', a_formData.ticket_id);
        formData.append('visit_type', a_formData.visit_type);
        formData.append('visit_by', a_formData.visit_by);
        formData.append('visit_date', a_formData.visit_date);
        formData.append('remarks', a_formData.remarks);
        for (let doc of this.documents) {
          let file = (doc.form_data.get('file') as File);
          let name = file.name;
          let actualName = doc.form_data.get('file_name');
          let ext = name.split('.')[1];
          let filename = `${actualName}.${ext}`;
          formData.append('doc_files', file, filename);
        }

        this.ticketService.addVisit(formData).subscribe(res => {
          this.utilsService.showSuccessToast('Visit completed successfully');
          this.back();
        })
      } else {
        this.utilsService.showErrorToast('Please upload documents');
      }
    }
  }

  onVisitTypeChange() {
    let type = this.visitForm.get('visit_type').value;
    if (type == 1) {
      this.visitForm.get(['visit_by']).setValue(this.userDetails.display_name);
      this.visitForm.get(['visit_by']).disable();
    } else {
      this.visitForm.get(['visit_by']).setValue(null);
      this.visitForm.get(['visit_by']).enable();
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
