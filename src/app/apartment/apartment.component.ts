import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent implements OnInit {
  avatarBlobUrl: any;
  photoMessage: string;
  deleteMessage: string;
  apartments: [];

  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Object[]> = new Subject();

  constructor(private data: ApiService) {}

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      pagingType: 'full_numbers'
    };
    this.getApartments();
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();

    if (image) {
      reader.readAsDataURL(image);
    }

    reader.addEventListener(
      'loadend',
      () => {
        this.avatarBlobUrl = reader.result;
        // console.log(this.avatarBlobUrl);
      },
      false
    );
  }

  dismissAlert() {
    this.deleteMessage = null;
  }

  // function that opens modal and displays an image
  displayImage(apartmentID: Number) {
    console.log(apartmentID);
    this.data.getImage(`apartments/${apartmentID}/getavatar/`).subscribe(
      res => {
        console.log(res);
        if (res === null) {
          this.photoMessage =
            'Unable to retrieve image or image is not available.';
        } else {
          this.photoMessage = 'Here is the image';
          this.avatarBlobUrl = this.createImageFromBlob(res);
        }
      },
      err => {
        console.log(err);
        this.photoMessage = 'Image not found.';
      }
    );
  }

  getApartments() {
    this.data.getAuthData('apartments/').subscribe(res => {
      console.log(res);
      if (res.code === 200) {
        this.apartments = res.details;
        this.dtTrigger.next();
      } else {
        this.deleteMessage = res.details;
      }
    });
     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.destroy();
       this.dtTrigger.next();
     });
  }

  deleteApartment(apartmentID: number) {
    this.data.deleteAuthData(`apartments/${apartmentID}`).subscribe(res => {
      console.log(res);
      if (res.code === 200) {
        this.getApartments();
      } else {
        this.deleteMessage = res.details;
      }
    });
  }
}
