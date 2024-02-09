import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{


  email: string = '';


  constructor(private firebaseService:FirebaseService){}

  ngOnInit(): void {
    
  }

  // Change password method 
  changePassword() {
    if(this.email == "")
      alert("Please enter your email address");
    else{
      // Call the FirebaseService forgotPassword function
      this.firebaseService.changePassword(this.email);
      // Clear the email field
      this.email = '';
    }
  }
}
