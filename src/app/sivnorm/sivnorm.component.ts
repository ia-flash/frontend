import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';

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
  inputCsv : any;
  tbRefname: string = "siv";
  selectedTab: string;
  burger = false;

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
    this.selectedTab = 'sivnorm';
  }

  toggleBurger() {
    this.burger = !this.burger;
  }

  onClickMe() {
    this.loading = true;
    this.predictionService.callSivnorm(this.marque, this.modele, this.tbRefname).subscribe(result => {
      this.loading = false;
      console.log(result);
      this.clean_marque = result.marque;
      this.clean_modele = result.modele;
      this.score = result.score;
    });
  }

  onFileSelected(event) {
    this.files = event.target.files;
    const files: FileList = event.target.files;
    if(files.length > 0) {
      this.currentInput = files[0].name;
      console.log(files[0]);

      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        this.inputCsv = fileReader.result;
        console.log( this.inputCsv.split("\n").map(item => item.split(",")));
        this.inputCsv =  this.inputCsv.split("\n").map(item => item.split(","));
        }
        fileReader.readAsText(this.files[0]);

    }
  }

  clickCsv() {
    this.loading = true;
    this.predictionService.callSivnormCsv(this.files, this.tbRefname).subscribe(result => {
      this.loading = false;
      this.resultCsv = result.split("\n").map(item => item.split(","));
      console.log(result.split("\n").map(item => item.split(",")));
    });
  }

}
