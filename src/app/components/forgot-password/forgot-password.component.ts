import { Component, OnInit } from '@angular/core';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormsModule } from '@angular/forms';



// Define and export the ForgotPassword component
@Component({
selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
  
})




export class ForgotPasswordComponent implements OnInit {

  email: string = '';

  // Inject the FirebaseService into the component
  constructor(private firebaseService: FirebaseService) { }

  // Define the ngOnInit function
  ngOnInit(): void {
  }

  // Define the forgotPassword function
  forgotPassword() {

    if(this.email == "")
      alert("Please enter your email address");
    else{
      // Call the FirebaseService forgotPassword function
      this.firebaseService.forgotPassword(this.email);
      // Clear the email field
      this.email = '';
    }
  }


}
