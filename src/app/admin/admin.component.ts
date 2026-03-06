import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../shared/models/users.model';
import { ManageUsersService } from '../shared/services/manage-users.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  loggedInUserId = '';
  isUserLoggedIn = false;

  loggedInUser = {
    Id: '',
    UserId: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Permissions: ''
  };

  users: Users[] = [];
  userToManage = '';
  userManagementAction = '';

  newUserFirstName = '';
  newUserLastName = '';
  newUserEmail = '';
  newUserPermissions = '';
  newUserVehicleDriven: string[] = [];

  vehicleOptions = [
    { value: 'Toyota-HILUX', label: 'Toyota HILUX' },
    { value: 'Mitsubishi-L200', label: 'Mitsubishi L200' },
    { value: 'AIGAION-Rescue-16', label: 'AIGAION Rescue 16' },
  ];

  isUserCreationSuccessfull = false;
  isUserUpdateSuccessfull = false;
  isUserDeletionSuccessfull = false;

  constructor(private router: Router, private manageUsersService: ManageUsersService) {}

  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));

    console.log(this.loggedInUserId)

    this.GetUsers();
  }

  GetUsers() {

    this.manageUsersService.getUsers()
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            const responseData = new Array<any>(...res);

            this.users = [];

            for (const data of responseData) {

              const resObj = new Users();

              // Map camelCase DB columns to PascalCase model
              resObj.Id = data.id;
              resObj.UserId = data.userId;
              resObj.FirstName = data.firstName;
              resObj.LastName = data.lastName;
              resObj.Email = data.email;
              resObj.Permissions = data.permissions;
              resObj.VehicleDriven = data.vehicleDriven || '';

              if (resObj.FirstName != 'Σκίουρος') this.users.push(resObj);
            }

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  ManageSelectedUserDetails() {
    let selectedUser = this.users.find((user: Users) => user.UserId === this.userToManage)

    this.newUserFirstName = selectedUser!.FirstName;
    this.newUserLastName = selectedUser!.LastName;
    this.newUserEmail = selectedUser!.Email;
    this.newUserPermissions = selectedUser!.Permissions;
    this.newUserVehicleDriven = selectedUser!.VehicleDriven ? selectedUser!.VehicleDriven.split('|') : [];
  }

  CreateUser() {

    this.manageUsersService.createUser(
      this.newUserEmail,
      this.newUserFirstName,
      this.newUserLastName,
      this.newUserPermissions,
      this.newUserVehicleDriven.join('|')
    )
      .then(() => {
        this.isUserCreationSuccessfull = true;

        setTimeout(() => {
          this.isUserCreationSuccessfull = false;
        }, 2000);

        this.GetUsers();
        this.ClearFieldValues();
      })
      .catch((error) => {
        console.log('Create user error:', error);
      });
  }

  UpdateUser() {

    this.manageUsersService.updateUser(
      this.userToManage,
      this.newUserEmail,
      this.newUserFirstName,
      this.newUserLastName,
      this.newUserPermissions,
      this.newUserVehicleDriven.join('|')
    )
      .then(() => {
        this.isUserUpdateSuccessfull = true;

        setTimeout(() => {
          this.isUserUpdateSuccessfull = false;
        }, 2000);

        this.GetUsers();
      })
      .catch((error) => {
        console.log('Update user error:', error);
      });
  }

  DeleteUser() {

    this.manageUsersService.deleteUser(this.userToManage)
      .then(() => {
        this.isUserDeletionSuccessfull = true;

        setTimeout(() => {
          this.isUserDeletionSuccessfull = false;
        }, 2000);

        this.GetUsers();
        this.ClearFieldValues();
      })
      .catch((error) => {
        console.log('Delete user error:', error);
      });
  }

  ClearFieldValues() {
    this.userToManage = '';
    this.newUserFirstName = '';
    this.newUserLastName = '';
    this.newUserEmail = '';
    this.newUserPermissions = '';
    this.newUserVehicleDriven = [];
  }

  toggleVehicle(value: string) {
    const idx = this.newUserVehicleDriven.indexOf(value);
    if (idx === -1) {
      this.newUserVehicleDriven.push(value);
    } else {
      this.newUserVehicleDriven.splice(idx, 1);
    }
  }

}
