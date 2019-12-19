import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { environment } from '../../environments/environment';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-sivnorm',
  templateUrl: './sivnorm.component.html',
  styleUrls: ['./sivnorm.component.scss']
})
export class SivnormComponent implements OnInit {
  marque: string = "renault";
  modele: string = "clio";
  clean_marque: string;
  clean_modele: string;
  score: number;
  currentInput: any;
  files: FileList;
  resultCsv: any;
  loading: boolean;
  progress: number;
  inputCsv : any;
  tbRefname: string = "siv";
  selectedTab: string;
  burger = false;
  gpu = environment.gpu;

  constructor(
    private predictionService: PredictionsService,
    public googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.selectedTab = 'sivnorm';
  }

  toggleBurger() {
    this.burger = !this.burger;
  }

  onClickMe() {
    this.googleAnalyticsService.eventEmitter('sivnorm', 'api', `${this.tbRefname}&${this.modele}&${this.marque}`, 1);
    this.loading = true;
    this.predictionService.callSivnorm(this.marque, this.modele, this.tbRefname).subscribe(result => {
      this.loading = false;
      console.log(result);
      this.clean_marque = result.marque;
      this.clean_modele = result.modele;
      this.score = result.score;
    }, error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  onFileSelected(event) {
    this.files = event.target.files;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.currentInput = files[0].name;
      console.log(files[0]);

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        this.inputCsv = fileReader.result;
        console.log( this.inputCsv.split('\n').map(item => item.split(',')));
        this.inputCsv =  this.inputCsv.split('\n').map(item => item.split(','));
      };
      fileReader.readAsText(this.files[0]);

    }
  }

  clickCsv() {
    this.googleAnalyticsService.eventEmitter('sivnorm', 'api', `${this.tbRefname}&csv`, 1);
    this.loading = true;
    this.predictionService.callSivnormCsv(this.files, this.tbRefname).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.loading = false;
            this.progress = null;
            this.resultCsv = event.body.split('\n').map(item => item.split(','));
            console.log(this.resultCsv);
        }
      }, error => {
        this.loading = false;
        this.progress = null;
        console.log(error);
      }
    );
  }

}
