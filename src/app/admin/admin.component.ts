import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../shared/models/users.model';
import { ManageUsersService } from '../shared/services/manage-users.service';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { Vehicle } from '../shared/models/vehicle.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  newVehiclePlateNumber = '';
  newVesselRegistrationNumber = '';
  updateVehiclePlateNumber = '';
  updateVesselRegistrationNumber = '';
  initialKilometers = 0;

  userVehicleLicenses: any[] = [];
  userBoatLicenses: any[] = [];

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

  isUsersCollapsed = true;

  // Vehicle management
  isVehiclesCollapsed = true;
  vehicleAction = 'add_vehicle';
  vehicles: Vehicle[] = [];
  newVehicleName = '';
  newVehicleType = 'vehicle';
  vehiclePhotoFile: File | null = null;
  vehicleToDelete = 0;
  vehicleToUpdate = 0;
  updateVehicleName = '';
  updateVehicleType = 'vehicle';
  updateVehiclePhotoFile: File | null = null;
  vehicleMessage = '';
  vehicleMessageType: 'success' | 'danger' | '' = '';
  isVehicleActionSuccessfull = false;

  constructor(private router: Router, private manageUsersService: ManageUsersService, private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));

    console.log(this.loggedInUserId)

    this.GetUsers();
    this.GetVehicles();
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

    // Fetch licenses for this user
    if (this.userToManage) {
      this.dbFunctionService.listDriverLicenses('vehicle', this.userToManage).then((all) => {
        this.userVehicleLicenses = all || [];
      });
      this.dbFunctionService.listDriverLicenses('boat', this.userToManage).then((all) => {
        this.userBoatLicenses = all || [];
      });
    } else {
      this.userVehicleLicenses = [];
      this.userBoatLicenses = [];
    }
  }
  downloadLicense(fileName: string, type: 'vehicle' | 'boat') {
    this.dbFunctionService.downloadDriverLicense(fileName, type).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
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

  // ── Vehicle Management ──

  GetVehicles() {
    this.dbFunctionService.getVehicles()
      .then((res: any[]) => {
        this.vehicles = (res || []).map(v => ({
          id: v.id,
          name: v.name,
          type: v.type,
          vehiclePlateNumber: v.vehiclePlateNumber || '',
          vesselRegistrationNumber: v.vesselRegistrationNumber || '',
          initialKilometers: v.initialKilometers || 0
        }));
        console.log('Fetched vehicles:', this.vehicles);
      })
      .catch((err: any) => console.error('Failed to fetch vehicles:', err));
  }

  OnVehiclePhotoSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.vehiclePhotoFile = files[0];
    }
  }

  OnUpdateVehiclePhotoSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.updateVehiclePhotoFile = files[0];
    }
  }

  ManageSelectedVehicleDetails() {
    const selected = this.vehicles.find(v => v.id === this.vehicleToUpdate);
    if (selected) {
      this.updateVehicleName = selected.name;
      this.updateVehicleType = selected.type;
      this.updateVehiclePlateNumber = selected.vehiclePlateNumber || '';
      this.updateVesselRegistrationNumber = selected.vesselRegistrationNumber || '';
      this.initialKilometers = selected.initialKilometers || 0;
    }
  }

  async AddVehicle() {
    this.vehicleMessage = '';
    this.vehicleMessageType = '';

    if (!this.newVehicleName.trim()) {
      this.vehicleMessage = 'Παρακαλώ εισάγετε το όνομα του οχήματος.';
      this.vehicleMessageType = 'danger';
      return;
    }

    try {
      await this.dbFunctionService.addVehicle(
        this.newVehicleName.trim(),
        this.newVehicleType,
        this.newVehicleType === 'vehicle' ? this.newVehiclePlateNumber : '',
        this.newVehicleType === 'boat' ? this.newVesselRegistrationNumber : '',
        this.initialKilometers
      );

      if (this.vehiclePhotoFile) {
        await this.dbFunctionService.uploadVehiclePhoto(this.newVehicleName.trim(), this.vehiclePhotoFile);
      }

      this.isVehicleActionSuccessfull = true;
      this.vehicleMessage = 'Το όχημα προστέθηκε με επιτυχία!';
      this.vehicleMessageType = 'success';
      this.GetVehicles();
      this.ClearVehicleFields();

      setTimeout(() => { this.isVehicleActionSuccessfull = false; }, 2000);
    } catch (error: any) {
      this.vehicleMessage = 'Σφάλμα κατά την προσθήκη. ' + (error.message || '');
      this.vehicleMessageType = 'danger';
    }
  }

  async DeleteVehicle() {
    this.vehicleMessage = '';
    this.vehicleMessageType = '';

    if (!this.vehicleToDelete) {
      this.vehicleMessage = 'Παρακαλώ επιλέξτε ένα όχημα.';
      this.vehicleMessageType = 'danger';
      return;
    }

    try {
      await this.dbFunctionService.deleteVehicle(this.vehicleToDelete);
      this.isVehicleActionSuccessfull = true;
      this.vehicleMessage = 'Το όχημα διαγράφηκε με επιτυχία!';
      this.vehicleMessageType = 'success';
      this.GetVehicles();
      this.vehicleToDelete = 0;

      setTimeout(() => { this.isVehicleActionSuccessfull = false; }, 2000);
    } catch (error: any) {
      this.vehicleMessage = 'Σφάλμα κατά τη διαγραφή. ' + (error.message || '');
      this.vehicleMessageType = 'danger';
    }
  }

  async UpdateVehicle() {
    this.vehicleMessage = '';
    this.vehicleMessageType = '';

    if (!this.vehicleToUpdate) {
      this.vehicleMessage = 'Παρακαλώ επιλέξτε ένα όχημα.';
      this.vehicleMessageType = 'danger';
      return;
    }

    try {
      const vehicleData: any = {
        id: this.vehicleToUpdate,
        name: this.updateVehicleName.trim(),
        type: this.updateVehicleType,
        vehiclePlateNumber: this.updateVehicleType === 'vehicle' ? this.updateVehiclePlateNumber : '',
        vesselRegistrationNumber: this.updateVehicleType === 'boat' ? this.updateVesselRegistrationNumber : ''
      };
      await this.dbFunctionService.updateVehicle(vehicleData);

      if (this.updateVehiclePhotoFile) {
        await this.dbFunctionService.replaceVehiclePhoto(this.updateVehicleName.trim(), this.updateVehiclePhotoFile);
      }

      this.isVehicleActionSuccessfull = true;
      this.vehicleMessage = 'Το όχημα ενημερώθηκε με επιτυχία!';
      this.vehicleMessageType = 'success';
      this.GetVehicles();
      this.ClearVehicleFields();

      setTimeout(() => { this.isVehicleActionSuccessfull = false; }, 2000);
    } catch (error: any) {
      this.vehicleMessage = 'Σφάλμα κατά την ενημέρωση. ' + (error.message || '');
      this.vehicleMessageType = 'danger';
    }
  }

  ClearVehicleFields() {
    this.newVehicleName = '';
    this.newVehicleType = 'vehicle';
    this.newVehiclePlateNumber = '';
    this.newVesselRegistrationNumber = '';
    this.initialKilometers = 0;
    this.vehiclePhotoFile = null;
    this.vehicleToDelete = 0;
    this.vehicleToUpdate = 0;
    this.updateVehicleName = '';
    this.updateVehicleType = 'vehicle';
    this.updateVehiclePlateNumber = '';
    this.updateVesselRegistrationNumber = '';
    this.updateVehiclePhotoFile = null;
  }

}
