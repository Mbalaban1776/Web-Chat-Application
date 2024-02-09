// chat.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore ,DocumentReference} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Message } from '../model/message.model';
import { switchMap ,map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }
  

  
}




