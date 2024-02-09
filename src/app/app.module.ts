import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LogoutComponent } from './components/logout/logout.component';
import { FirebaseService } from './services/firebase.service';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { SettingsComponent } from './components/settings/settings.component';
import { ChatsComponent } from './components/chats/chats.component';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    MainComponent,
    LogoutComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    SettingsComponent,
    ChatsComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot([
      {
        path: 'login',
        component:LoginComponent
      },
      {
        path: 'sign-up',
        component:SignUpComponent
      },
      {
        path: 'main',
        component:MainComponent,
        children:[
          { 
            path: '', 
            redirectTo: 'chats', 
            pathMatch: 'full' },
          {
            path: 'chats',
            component: ChatsComponent
          },
          {
            path: 'settings',
            component: SettingsComponent
          },
        ]
      },
      {
        path: 'logout',
        component:LogoutComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      }
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
