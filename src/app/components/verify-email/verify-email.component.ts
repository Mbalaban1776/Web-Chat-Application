import { Component } from '@angular/core';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  email = faEnvelopeCircleCheck;

  constructor(){}
}

