import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore:AngularFirestore,
    private auth: AngularFireAuth,
    private db:AngularFireDatabase
  ) { }
  
  
 

  // login method

  login(email:string,password:string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then((res) => {
      this.router.navigate(['/main']);
      localStorage.setItem('token', 'true');
      // if(res.user?.emailVerified){
      //   this.router.navigate(['/main']);
      // }
      // else{
      //   this.router.navigate(['/verify-email']);
      // }
    }, err => {
      alert('Something went wrong. Please make sure you typed your email and password correctly.');
      this.router.navigate(['/login']);
    })
  }

  // Sign in method
  register(email: string, password: string,name: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          const uid = userCredential.user.uid;
          this.saveUserInfo(uid, name, email);
          this.storeUserData(uid, name);
          localStorage.setItem('token', 'true');
          this.sendEmailForVarification(userCredential.user);
        } else {
          // Handle the case where userCredential.user is null
          alert('User registration failed');
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  // Stores newly registered user's name in firestore.
  storeUserData(uid: string, name: string) {
    this.firestore.collection('users').doc(uid).set({
      name: name
    });
  }
  
  saveUserInfo(uid: string, userName: string, email: string): Promise<void> {
    const userRef = this.db.object(`users/${uid}`);

    // Save user information in the database
    return userRef.set({
      name: userName,
      email: email,
    });
  }

  // Send verification link
  sendEmailForVarification(user:any){
    user.sendEmailVerification().then( (res:any) => {
      this.router.navigate(['/verify-email']);
      alert("Link has successfully sent to your email. Please verify your email as soon as possible.");
    }, (err:any)=>{
      alert('Something went wrong. Not able to send verification link to your email.');
    })
  }

  //log out method

  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/logout']);
    }, err => {
      alert('Something went wrong.');
    })
  }


// forgot password method
  
  forgotPassword(email: string) {

      this.fireauth.sendPasswordResetEmail(email).then(() => {
        alert('Password reset email sent');
        this.router.navigate(['/login']);
      }, err => {
        alert("Something went wrong. Couldn't send link to you");
        this.router.navigate(['/forgot-password']);
      })
    }

  // getCurrentUser() {
  //   return this.fireauth.authState;
  // }

  // If user wants to change his/her password from settings menu
  changePassword(email: string){
    
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      alert('Password change link has sent. Please login again after changing the password.');
      this.router.navigate(['/login']);
    }, err => {
      alert("Something went wrong. Couldn't send the link to you.");
      this.router.navigate(['/main/settings']);
    })
  }


}
