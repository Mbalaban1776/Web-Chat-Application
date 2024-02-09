import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked ,Renderer2} from '@angular/core';
import { faMessage ,faBell ,faUser,faPaperPlane, faMoon} from '@fortawesome/free-regular-svg-icons';
import { faPhone,faGear,faRightFromBracket ,faSearch} from '@fortawesome/free-solid-svg-icons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, timestamp } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { StylingService } from 'src/app/shared/styling.service';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Timestamp } from 'firebase/firestore';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
  
  
 
export class MainComponent implements OnInit, AfterViewChecked{
  search = faSearch;
  user = faUser;
  message = faMessage;
  phone = faPhone;
  bell = faBell;
  settings = faGear;
  log_out = faRightFromBracket;
  send = faPaperPlane;
  name: any;
  profilePhotoUrl: any;
  messages: any;
  
  flag = true;
  
  userId: string;
  showConfirmation = false; // Başlangıçta onay iletişim kutusu gizlenmiş
  confirmationText = 'Çikiş yapmak istediğinize emin misiniz?';
  darkMode = faMoon;

  theme = "Default";

  selectedUserName: string = ''; 
  selectedUserPhoto: string = ''; 
  selected = false;
  
  
  chats: any[];
  people:any[]=[];  

  currentUserId: string; // Add this property


  inputMessage: any;
  selectedChatId: any;
  selectUserId: any;
  isGroup = false;

  chatKey: any;
  members: {[key: string]: string} = {};

  sub: any;

  @ViewChild('chatContainer') private chatContainer: ElementRef;

  
  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public styleService: StylingService,
    private chatService: ChatService,
    private db: AngularFireDatabase,
    private renderer: Renderer2
  ) {

    
   }
  
  
  
  ngOnInit(): void {
    
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid; 
        this.getUserInformation();
        
      }
    });
    
  }
  
  ngAfterViewChecked(): void {
    this.scrollChatToBottom();
  }
  
  scrollChatToBottom(): void {
    if(this.chatContainer){
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
  
  getUserInformation() {
    this.db.object(`/users/${this.currentUserId}`).valueChanges().subscribe((userData: any) => {
      if (userData == null) {
        this.afAuth.signOut().then(() => {
          this.router.navigate(['/login']);
        })
      }
      this.name = userData.username;
      
      this.profilePhotoUrl = userData.profilePhoto;
      
      
      if (this.profilePhotoUrl != "") {
        this.flag = false;
      }
    })

    this.db.object(`/users/${this.currentUserId}/chats`).valueChanges().subscribe((userData: any) => {

      let chats = userData;
      this.chats = [];
      let found = false;
      
      for(const chat of Object.entries(chats).map(([key, value]) => ({  key, value  }))){
        let temp:any = chat.value;
        temp.key = chat.key;
        if(temp.id == this.selectedChatId)
          found = true;
        this.addElementIfUnique(this.chats, temp);
      }

      if(!found){
        this.selected = false;
        if(this.sub)
          this.sub.unsubscribe();
      }

      this.chats = this.chats.sort((a, b) => a.time - b.time);

      this.getChatInformation();
      
    })
    
  }
  
  getChatInformation() {
      
    this.people=[];
    
    for (const chat of this.chats) {
     
      if(!chat.hasOwnProperty('group')){
        let sub = this.db.object(`/users/${chat.key}`).valueChanges().subscribe((userData: any) => {
          if (userData != null) {
            
            userData.id = chat.id;
            userData.key = chat.key;
            userData.group = false;

            this.addElementIfUnique(this.people, userData);
            sub.unsubscribe();
          }
        })
      }
      else{
        let sub = this.db.object(`/GroupChats/${chat.id}`).valueChanges().subscribe((userData: any) => {
          if (userData != null) {
            
            userData.id = chat.id;
            userData.key = chat.key;
            userData.group = true;
            userData.username = userData.name;
            userData.profilePhoto = userData.groupPhoto;

            this.addElementIfUnique(this.people, userData);
            sub.unsubscribe();
          }
        })
      }
    }
  }


  addElementIfUnique(chats: any[], newElement: any): void {
    if (!chats.some(obj => obj.id === newElement.id)) {
      chats.unshift(newElement);
    }
    else{
      // Remove existing element with the same id
      chats = chats.filter(obj => obj.id !== newElement.id);
    
      // Append the newElement to the beginning of the array
      chats.unshift(newElement);
    }
  }

  getKeyFromString(encodedKeyString: string): CryptoJS.lib.WordArray {
    const decodedKey = CryptoJS.enc.Base64.parse(encodedKeyString);
    return decodedKey;
  }

  getChats(chat:any) {
    this.selected = true;
    if(this.sub)
      this.sub.unsubscribe();
    if(!chat.group){
      this.selectedUserName = chat.username;
      this.selectedUserPhoto = chat.profilePhoto;
      this.selectedChatId = chat.id;
      this.selectUserId = chat.key;
      this.isGroup = false;
      this.members = {};

      let sub = this.db.object(`/IndividualChats/${chat.id}/key`).valueChanges().subscribe((key: any) => {

          this.chatKey = this.getKeyFromString(key);
          this.sub = this.db.object(`/IndividualChats/${chat.id}/Messages`).valueChanges().subscribe((chatMessages: any) => {
            this.db.object(`/users/${this.currentUserId}/chats/${chat.id}`).update({
              read: true
            })
              this.messages = []; 
              if (chatMessages == null) {
                this.messages = null
              }
              else {   
                this.messages=Object.values(chatMessages);      
            
                console.log(this.messages);
              }
            })
          sub.unsubscribe();
        })
    }
    else{
      this.selectedUserName = chat.username;
      this.selectedUserPhoto = chat.profilePhoto;
      this.selectedChatId = chat.id;
      this.selectUserId = null;
      this.isGroup = true;
      this.members = chat.members;

      this.db.object(`/GroupChats/${chat.id}`).valueChanges().subscribe((userData: any) => {
        if (userData != null) {
          let members = userData["members"];
          if(userData["prevMembers"] != null){
          this.members = userData["prevMembers"];
          }
          else
            this.members = {};
          for(const member of Object.values(members) as string[]){
              let sub = this.db.object(`/users/${member}/username`).valueChanges().subscribe((userData: any) => {
                if (userData != null) {
                  this.members[member] = userData.toString();
                  sub.unsubscribe();
                }
              })
            
          }
        }
      })

      let sub = this.db.object(`/GroupChats/${chat.id}/key`).valueChanges().subscribe((key: any) => {

        this.chatKey = this.getKeyFromString(key);
        this.sub = this.db.object(`/GroupChats/${chat.id}/Messages`).valueChanges().subscribe((chatMessages: any) => {
          this.db.object(`/users/${this.currentUserId}/chats/${chat.id}`).update({
            read: true
          })
          this.messages = [];
          if (chatMessages == null) {
            this.messages = null
          }
          else {   
            this.messages=Object.values(chatMessages);      
            console.log(this.messages);
          }
        })
        sub.unsubscribe();
      })
    }
    
  }

  encryptMessage(message: string): string {
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const encrypted = CryptoJS.AES.encrypt(message, this.chatKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    return encrypted.toString();
  }
  
  decyptMessage(encryptedMessage: string): string {
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, this.chatKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  
  sendMessage() {
    if (this.inputMessage.trim() !="") {
      if(!this.isGroup){
        this.db.list(`/IndividualChats/${this.selectedChatId}/Messages`).push({
          message: this.encryptMessage(this.inputMessage.trim()),
          senderId: this.currentUserId
        })
        this.inputMessage = "";
        this.db.object(`/users/${this.selectUserId}/chats/${this.currentUserId}`).update({
          read: false,
          time: Timestamp.now().seconds
        })
        this.db.object(`/users/${this.currentUserId}/chats/${this.selectUserId}`).update({
          read: true,
          time: Timestamp.now().seconds
        })
      }
      else{
        this.db.list(`/GroupChats/${this.selectedChatId}/Messages`).push({
          message: this.encryptMessage(this.inputMessage.trim()),
          senderId: this.currentUserId
        })
        this.inputMessage = "";
        for(let user of Object.keys(this.members)){
          this.db.object(`/users/${user}/chats/${this.selectedChatId}`).update({
            read: false,
            time: Timestamp.now().seconds
          })
        }
      }
    }
  }
  

  
  

  getFirstWord(input: string){
    const words = input.split(' ');
    if (words.length > 0) {
      return words[0];
    } else {
      return '';
    }
  }
  
  toggleIcon() {
    this.showConfirmation = !this.showConfirmation; // Her tıklamada bilgi durumunu tersine çevir
  }

  confirmLogout() {
    // Kullanıcı "Evet" seçeneğini tıkladığında yapılacak işlemler burada olmalı
    // Örneğin, çıkış işlemini gerçekleştirebilirsiniz
    // Ardından onay iletişim kutusunu gizleyebilirsiniz
    this.logout(); // Çıkış işlemini gerçekleştirin (örnek)
    this.showConfirmation = false; // Onay iletişim kutusunu gizle
  }
  
  cancelLogout() {
    // Kullanıcı "Hayır" seçeneğini tıkladığında yapılacak işlemler burada olmalı
    // İptal işlemini gerçekleştirerek onay iletişim kutusunu gizleyebilirsiniz
    this.showConfirmation = false; // Onay iletişim kutusunu gizle
  }
  
  openSettings(){
    
    if (this.router.url.indexOf('/settings') > -1)    // If the settings are already opened ,clases it
      this.router.navigate(['main']);
    else
      this.router.navigate(['settings'], {relativeTo: this.route});   // Opens settings
  }

  logout() {
    this.firebaseService.logout();
  }  
}
