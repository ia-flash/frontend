import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iaflash';
  selectedTab = 'preview';
  burger = false;

  toggleBurger() {
    this.burger = !this.burger;
  }
}
