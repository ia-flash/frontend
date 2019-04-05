import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  currentInput: string;
  imgUrl: any;

  constructor() { }

  ngOnInit() {
  }

  onFileSelected(event) {
    if(event.target.files.length > 0) {
      this.currentInput = event.target.files[0].name;

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
        this.imgUrl = reader.result; 
      }
    }
  }

}
