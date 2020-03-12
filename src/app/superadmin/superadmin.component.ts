import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit, OnDestroy, AfterViewInit {
  userForm: FormGroup;
  submitted = false;
  users: [];
  toggle =  true;
  username: String;
  message: string;
  deleteMessage: string;

  @ViewChild(DataTableDirective, { static: false })

  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Object[]> = new Subject();

  constructor(private data: ApiService, private formBuilder: FormBuilder) { }

  get f() { return this.userForm.controls; }

  ngOnInit() {
    this.userForm = this.formBuilder.group ({
      username: ['', Validators.required],
      email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,5}$')],
      password: ['', Validators.required],
      user_type: ['', Validators.required]
    });

    this.dtOptions = {
      pageLength: 10,
      pagingType: 'full_numbers'
    };

    this.getCustomUsers();
  }

  getCustomUsers() {
    this.data.getAuthData('customusers')
    .subscribe(
      res => {
        console.log(res);
        if (res.code === 200) {
          this.users = res.details;
          this.dtTrigger.next();
        }
      }
    );
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

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    console.log(this.userForm.value);
    this.data.postAuthData('customusers/', this.userForm.value)
    .subscribe(
      res => {
        // console.log(res);
        if (res.code === 200) {
          this.userForm.reset();
          this.submitted = false;
          this.getCustomUsers();
          this.message = res.details;
        } else {
          this.message = res.details;
        }
      }
    );
  }

  dismissAlert() {
    this.message = null;
  }

  onUpdate(username: String) {
    this.submitted = false;
    this.toggle = !this.toggle;
    this.username = username;

    this.data.getAuthData(`customusers/${this.username}/`)
    .subscribe(
      res => {
        // console.log(res);
        if (res.code === 200) {
          this.userForm.patchValue({username: res.details.username});
          this.userForm.patchValue({email: res.details.email});
          this.userForm.patchValue({password: res.details.password});
          this.userForm.patchValue({user_type: res.details.user_type});
        }
      }
    );
  }

  updateUser() {
    this.submitted = true;
    console.log(this.username);
    this.data.putAuthData(`customusers/${this.username}/`, this.userForm.value)
    .subscribe(
      res => {
        console.log(res);
        if (res.code === 200) {
          this.userForm.reset();
          this.submitted = false;
          this.getCustomUsers();
          this.message = res.details;
        } else {
          this.message = res.details;
        }
      }
    );
  }

  onDelete(username: String) {
    this.data.deleteAuthData(`customusers/${username}`)
    .subscribe(
      res => {
        console.log(res);
        if (res.code === 200) {
          this.getCustomUsers();
          this.deleteMessage = res.details;
        } else {
          this.deleteMessage = res.details;
        }
      }
    );
  }

}
