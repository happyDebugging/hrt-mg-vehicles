import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-users',
  template: `
    <ul>
      <li *ngFor="let user of users">{{ user.email }}</li>
    </ul>
  `
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: data => this.users = data as any[],
      error: err => console.error(err)
    });
  }
}
