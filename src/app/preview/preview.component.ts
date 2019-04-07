import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  currentInput: string;
  imgUrl: any;
  imgCanvas: any;
  probabilities: any;

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
    this.testFunction()
  }

  testFunction() {
    this.predictionService.testPrediction().subscribe(result => {
      console.log("Res");
      console.log(result);
    });
  }
  
  drawBox() {
    this.renderPredictions([
      {"bbox": [100, 100, 200, 200], "class": "car"}, 
      {"bbox": [200, 150, 200, 200], "class": "truck"}
    ])
  }

  drawPrediction() {
    this.renderPredictions([
      {"bbox": [100, 100, 200, 200], "class": "clio"}, 
    ])
    this.probabilities = [
      {'prob': 0.8, 'class': 'clio'},
      {'prob': 0.1, 'class': 'megane scenic 2'},
      {'prob': 0.05, 'class': 'Q3'},
      {'prob': 0.02, 'class': 'scenic'},
    ]
  }

  onFileSelected(event) {
    const files: FileList = event.target.files;
    if(files.length > 0) {
      this.predictionService.sendImage(files).subscribe(result => {
        console.log(result);
      })

      this.currentInput = files[0].name;
      console.log(files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.imgUrl = reader.result; 
        const image = new Image();
        image.src = this.imgUrl;
        this.imgCanvas = image
        image.onload = function() {
          const canvas = <HTMLCanvasElement> document.getElementById("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width  = image.width;
          canvas.height = image.height;
          ctx.drawImage(image,0, 0,image.width,image.height);
        }
      }
    }
  }


  renderPredictions = (predictions) => {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");

    const ctx = canvas.getContext("2d");

    canvas.width  = this.imgCanvas.width;
    canvas.height = this.imgCanvas.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.imgCanvas, 0, 0,this.imgCanvas.width,this.imgCanvas.height);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };

}
