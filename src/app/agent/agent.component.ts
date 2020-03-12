import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit, OnDestroy, AfterViewInit {
  agentForm: FormGroup;
  submitted = false;
  agentData: FormData;
  updatedAgentData: FormData;
  listedAgents: [];
  agentAvatar: any;
  agents: [];
  toggle = false;
  agentID: Number;
  avatarBlobUrl: any;
  photoMessage: String;
  imageUrl: String;
  updateNationalID: Number;
  showInput: Boolean;
  showButton: Boolean;
  updateAvatar: FormData;
  message: string;
  deleteMessage: string;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Object[]> = new Subject();

  constructor(private formBuilder: FormBuilder, private data: ApiService) {}

  ngOnInit() {
    this.getAgentsList();
    this.agentForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      national: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      phone: ['', [Validators.required, Validators.pattern('[7][0-9]{8}')]],
      photo: ['', Validators.required]
    });

    this.dtOptions = {
      pageLength: 10,
      pagingType: 'full_numbers'
    };
    this.getAgents();
  }

  getAgents() {
    this.data.getAuthData('agents/').subscribe(res => {
      if (res.code === 200) {
        this.agents = res.details;
        this.dtTrigger.next();
      }
    });
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  get f() {
    return this.agentForm.controls;
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  choosePhoto(file: any[]) {
    this.agentAvatar = file[0];
    this.showButton = !this.showButton;
  }

  dismissAlert() {
    this.message = null;
  }

  getAgentsList() {
    this.data
      .getUserofCertainType('customusers/getusersofsertype/?usertype=AGENT')
      .subscribe(res => {
        if (res.code === 200) {
          this.listedAgents = res.details;
        }
      });
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
      },
      false
    );
  }

  // function that opens modal and displays an image
  displayImage(agentID: Number, nationalID: Number) {
    this.updateNationalID = null;
    this.updateNationalID = nationalID;
    this.data.getImage(`agents/${agentID}/getavatar/`).subscribe(res => {
      // console.log(res);
      if (res === null) {
        this.photoMessage =
          'Unable to retrieve image or image is not available.';
      } else {
        this.avatarBlobUrl = this.createImageFromBlob(res);
      }
    });
  }

  chooseImage() {
    this.showInput = !this.showInput;
  }

  updateImage(updatedimage) {
    this.updateAvatar = new FormData();

    this.updateAvatar.append('agentNationalID', updatedimage.value);
    this.updateAvatar.append('agentAvatar', this.agentAvatar);

    this.data
      .postAuthData('agents/updateavatar/', this.updateAvatar)
      .subscribe(res => {
        if (res.code === 200) {
          this.photoMessage = res.details;
        } else {
          this.message = res.details;
        }
      });
  }

  onUpdate(ID: Number) {
    this.toggle = !this.toggle;
    this.agentID = ID;

    this.data.getAuthData(`agents/${this.agentID}/`).subscribe(res => {
      // console.log(res);
      if (res.code === 200) {
        this.agentForm.patchValue({ fullname: res.details.agentName });
        this.agentForm.patchValue({ phone: res.details.agentPhoneNumber });
        this.agentForm.patchValue({ national: res.details.agentNationalID });
      }
    });
  }

  updateAgent() {
    this.submitted = true;

    this.updatedAgentData = new FormData();

    this.updatedAgentData.append(
      'agentName',
      this.agentForm.get('fullname').value
    );
    this.updatedAgentData.append(
      'agentNationalID',
      this.agentForm.get('national').value
    );
    this.updatedAgentData.append(
      'agentPhoneNumber',
      this.agentForm.get('phone').value
    );
    this.updatedAgentData.append('agentAvatar', this.agentAvatar);
    this.updatedAgentData.append(
      'username',
      this.agentForm.get('username').value
    );

    this.data
      .putAuthData(`agents/${this.agentID}/`, this.updatedAgentData)
      .subscribe(res => {
        // console.log(res);
        if (res.code === 200) {
          this.agentForm.reset();
          this.submitted = false;
          this.getAgents();
          this.message = res.details;
        } else {
          this.message = res.details;
        }
      });
  }

  deleteAgent(ID: Number) {
    this.data.deleteAuthData(`agents/${ID}/`).subscribe(res => {
      if (res.code === 200) {
        this.getAgents();
        this.deleteMessage = res.details;
      } else {
        this.deleteMessage = res.details;
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    this.agentData = new FormData();

    if (this.agentForm.invalid) {
      return;
    }

    this.agentData.append('agentName', this.agentForm.get('fullname').value);
    this.agentData.append(
      'agentNationalID',
      this.agentForm.get('national').value
    );
    this.agentData.append(
      'agentPhoneNumber',
      this.agentForm.get('phone').value
    );
    this.agentData.append('agentAvatar', this.agentAvatar);
    this.agentData.append('username', this.agentForm.get('username').value);

    // console.log(this.agentForm.value);

    this.data.postAuthData('agents/', this.agentData).subscribe(res => {
      // console.log(res);
      if (res.code === 200) {
        this.agentForm.reset();
        this.submitted = false;
        this.getAgents();
        this.message = res.details;
      } else {
        this.message = res.details;
      }
    });
  }
}
