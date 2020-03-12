import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit, OnDestroy, AfterViewInit {
  branchForm: FormGroup;
  submitted = false;
  branchData: FormData;
  branches: [];
  toggle = true;
  ID: Number;
  regions: [];
  agents: [];
  message: string;
  deleteMessage: string;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Object[]> = new Subject();

  constructor(private formBuilder: FormBuilder, private data: ApiService) {}

  ngOnInit() {
    this.getRegions();
    this.getAgents();
    this.branchForm = this.formBuilder.group({
      branchName: ['', Validators.required],
      branchEmailAddress: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,5}$')]],
      region: [''],
      agent: [''],
      branchBuildingLocation: ['', Validators.required],
      branchLongitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      branchLatitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      branchPhoneNumber: ['', [Validators.required, Validators.pattern('[7][0-9]{8}')]]
    });

    this.dtOptions = {
      pageLength: 10,
      pagingType: 'full_numbers'
    };

    this.getBranches();
  }

  getBranches() {
    this.data.getAuthData('branches/').subscribe(res => {
      // console.log(res);
      if (res.code === 200) {
        this.branches = res.details;
        // this.dtTrigger.next();
      }
    });
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get f() {
    return this.branchForm.controls;
  }

  dismissAlert() {
    this.message = null;
  }

  getRegions() {
    this.data.getAuthData('regions/').subscribe(res => {
      console.log(res);
      if (res.code === 200) {
        this.regions = res.details;
      }
    });
  }

  getAgents() {
    this.data.getAuthData('agents/').subscribe(
      res => {
        if (res.code === 200) {
          this.agents = res.details;
        }
      }
    );
  }

  onUpdate(branchID: Number) {
    this.submitted = false;
    this.toggle = !this.toggle;
    this.ID = branchID;

    this.data.getAuthData(`branches/${this.ID}`).subscribe(res => {
      console.log(res);
      if (res.code === 200) {
        this.branchForm.patchValue({ branchName: res.details.branchName });
        this.branchForm.patchValue({ branchEmailAddress: res.details.branchEmailAddress });
        this.branchForm.patchValue({ branchPhoneNumber: res.details.branchPhoneNumber });
        this.branchForm.patchValue({ branchBuildingLocation: res.details.branchBuildingLocation });
        this.branchForm.patchValue({ branchLatitude: res.details.branchLatitude });
        this.branchForm.patchValue({ branchLongitude: res.details.branchLongitude });
        this.branchForm.patchValue({ region: res.details.region });
        this.branchForm.patchValue({ agent: res.details.agent });
      }
    });
  }

  updateBranch() {
    this.submitted = true;
    this.data
      .putAuthData(`branches/${this.ID}/`, this.branchForm.value)
      .subscribe(res => {
        console.log(res);
        if (res.code === 200) {
          this.getBranches();
          this.branchForm.reset();
          this.submitted = false;
          this.message = res.details;
        } else {
          this.message = res.details;
        }
      });
  }

  deleteBranch(branchID: Number) {
    this.data.deleteAuthData(`branches/${branchID}/`).subscribe(res => {
      console.log(res);
      this.message = null;
      if (res.code === 200) {
        this.getBranches();
        this.deleteMessage = res.details;
      } else {
        this.deleteMessage = res.details;
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.branchForm.invalid) {
      return;
    }

    this.data.postAuthData('branches/', this.branchForm.value).subscribe(
      res => {
        console.log(res);
        // this.message = null;
        if (res.code === 200) {
          this.branchForm.reset();
          this.submitted = false;
          this.getBranches();
          this.message = res.details;
        } else {
          this.message = res.details;
        }
      }
    );
  }
}
