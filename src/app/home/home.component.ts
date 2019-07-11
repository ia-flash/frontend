import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  burger = false;

  constructor() { }

  ngOnInit() {
  }

  toggleBurger() {
    this.burger = !this.burger;
  }


}
