import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';
import { PredBox } from '../predbox';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  currentInput: string;
  imgUrl: any;
  imgCanvas: any;
  probabilities: PredBox[];
  files: FileList;
  loadingDetect: boolean;
  loadingPredict: boolean;
  colors: string[] = ["is-primary","is-danger", "is-warning","is-link", "is-info", "is-success"]
  colorsHX: string[] = ["#20B2AA", "#DC5379", "#FFCA00","#264BEC", "#00BFFF","#17981a"]

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
  }

  testFunction() {
    this.predictionService.testPrediction().subscribe(result => {
      console.log("Res");
      console.log(result);
    });
  }
  
  drawBoxes() {
    this.loadingDetect = !this.loadingDetect;
    this.predictionService.objectDection(this.files).subscribe(result => {
      console.log(result);
      this.loadingDetect = !this.loadingDetect;
      this.renderPredictions(result)
    });
  }

  drawPrediction() {
    this.loadingPredict = !this.loadingPredict;
    this.predictionService.classPrediction(this.files).subscribe(predictions => {
      this.loadingPredict = !this.loadingPredict;
      this.probabilities = predictions;
      console.log(predictions)
      if (predictions.length > 0) {
        this.renderPredictions(predictions)
      }
    })
  }

  onFileSelected(event) {
    this.files = event.target.files;
    const files: FileList = event.target.files;
    if(files.length > 0) {
      this.probabilities = null

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

    let index = 0;
    predictions.forEach(prediction => {
      const x = prediction.x1;
      const y = prediction.y1;
      const width = prediction.x2 - prediction.x1;
      const height = prediction.y2 - prediction.y1;
      // Draw the bounding box.
      ctx.strokeStyle = this.colorsHX[index] //"#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = this.colorsHX[index] //"#00FFFF";
      const textWidth = ctx.measureText(prediction.label).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      index+=1;
    });

    predictions.forEach(prediction => {
      const x = prediction.x1;
      const y = prediction.y1;
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.label, x, y);
    });
  };

}
