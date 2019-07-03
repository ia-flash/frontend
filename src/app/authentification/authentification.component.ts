import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss']
})
export class AuthentificationComponent implements OnInit {
  username: string = 'test';
  password: string = 'test';

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
  }

  onClickMe() {
    const formData: FormData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    console.log(this.username);
    console.log(this.password);
    this.predictionService.login(formData).subscribe(result => {
      console.log(result);
    });
  }
}
