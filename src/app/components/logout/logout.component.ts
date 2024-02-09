import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  check=faCircleCheck;

  constructor(private router: Router){}

  returnToLogin(){
    this.router.navigate(['login']);
  }

}
