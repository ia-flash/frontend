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
    var image = new Image();

    // When the image has loaded, draw it to the canvas
    image.onload = function() {
      // draw image...
    }

    // Now set the source of the image that we want to load
    image.src = this.imgUrl
    this.renderPredictions(image, [{"bbox": [100, 100, 200, 200]}])
  }

  onFileSelected(event) {
    const files: FileList = event.target.files;
    if(files.length > 0) {
      this.predictionService.sendImage(files).subscribe(result => {
        console.log(result);
      })

      this.currentInput = files[0].name;
      var reader = new FileReader();
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.imgUrl = reader.result; 
      }
    }
  }


  renderPredictions = (image, predictions) => {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");

    const ctx = canvas.getContext("2d");

    canvas.width  = 300;
    canvas.height = 300;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    //ctx.drawImage(this.video,0, 0,300,300);
    ctx.drawImage(image,0, 0,300,300);

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
