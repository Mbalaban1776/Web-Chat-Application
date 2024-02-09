import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StylingService {
  
  theme = 'Default';

  constructor() { }

  updateTheme(theme: string){
    this.theme = theme;
  }
}
