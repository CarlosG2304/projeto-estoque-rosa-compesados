import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private appService: AppService) { }

  selectedTheme:string = 'arya-green'

  ngOnInit(): void {
        
    this.appService.switchTheme(this.selectedTheme);
  }
  checked = true

  changeTheme(theme: string) {
     
    this.appService.switchTheme(theme);
  }
}
