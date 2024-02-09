import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore:AngularFirestore) {}

  getPasswordByUsername(username: string) {
    return this.firestore.collection('users', ref => ref.where('username', '==', username)).valueChanges();
  }
  
  
}
