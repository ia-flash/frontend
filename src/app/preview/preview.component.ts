import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';
import { PredBox } from '../predbox';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  currentInput: any;
  imgCanvas: any; //{};
  objectKeys = Object.keys;
  probabilities: PredBox[];
  files: FileList;
  person: string = 'https://www.cdn.renault.com/content/dam/Renault/master/vehicules/renault-clio-b98-ph2/design/renault-clio-b98-ph2-design-exterior-001.jpg.ximg.l_full_m.smart.jpg';
  loadingDetect: boolean;
  loadingPredict: boolean;
  colors: string[] = ['is-primary', 'is-danger', 'is-warning',"is-link", "is-info", "is-success"]
  colorsHX: string[] = ['#253e7c', '#DC5379', '#FFCA00', '#264BEC', "#00BFFF","#17981a"]

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
    this.imgCanvas = {};
    this.currentInput = {};
    this.onInputUrlChange();
  }

  onInputUrlChange() {
    if (this.person) {
      this.currentInput[0] = this.person;
      const image = new Image();
      image.src = this.person;
      this.imgCanvas[0] = image;
      image.onload = () => {
        const canvas = document.getElementById(`canvas${0}`) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        canvas.width  = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
      };
    }
  }

  onFileSelected(selectedFiles) {

    this.files = selectedFiles; // event.target.files;
    const files: FileList = selectedFiles; // event.target.files;
    console.log(files);
    if (files.length > 0) {
      this.probabilities = null;
      Array.from(files).forEach((file, index) => {
        this.currentInput[index + 1] = file.name; // .push(file.name);
      });

      Array.from(files).forEach((file, index) => {
        console.log('index', index);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result as string;
          this.imgCanvas[index + 1] = image; // .push(image);
          image.onload = () => {
            const canvas = document.getElementById(`canvas${index + 1}`) as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            canvas.width  = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
          };
        };
      });
    }
  }

  addAttachementsToForm() {
    // Append attachements
    const formData: FormData = new FormData();
    if (this.files && this.files.length > 0) {
      Array.from(this.files).forEach(file => {
        formData.append('image', file, file.name);
      });
    }
    formData.append('url', this.person);
    return formData;
  }


  drawBoxes() {
    this.loadingDetect = true;
    console.log(this.person);

    const formData = this.addAttachementsToForm();

    this.predictionService.objectDection(formData).subscribe(result => {
      console.log(result);
      this.loadingDetect = false;
      this.renderPredictions(result);
    },
      error => {
        this.loadingDetect = false;
        console.log(error);
      });

  }


  drawPrediction() {
    this.loadingPredict = !this.loadingPredict;

    // Append attachements
    const formData = this.addAttachementsToForm();

    this.predictionService.classPrediction(formData).subscribe(predictions => {
      console.log(predictions);
      this.loadingPredict = false;
      this.probabilities = predictions;
      if (predictions.length > 0) {
        this.renderPredictions(predictions);
      }
    });
  }

  renderPredictions = (predictions) => {
    predictions.forEach((predictionsImage, index) => {
      console.log('Prediction INDEX', index);
      const canvas = document.getElementById(`canvas${this.person ? index : index + 1}`) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      canvas.width  = this.imgCanvas[this.person ? index : index + 1].width;
      canvas.height = this.imgCanvas[this.person ? index : index + 1].height;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Font options.
      const font = '16px sans-serif';
      ctx.font = font;
      ctx.textBaseline = 'top';
      ctx.drawImage(this.imgCanvas[this.person ? index : index + 1], 0, 0,
        this.imgCanvas[this.person ? index : index + 1].width, this.imgCanvas[this.person ? index : index + 1].height);

      predictionsImage.forEach((prediction, predictionIndex) => {
        const x = prediction.x1;
        const y = prediction.y1;
        const width = prediction.x2 - prediction.x1;
        const height = prediction.y2 - prediction.y1;
        // Draw the bounding box.
        ctx.strokeStyle = this.colorsHX[predictionIndex]; // "#00FFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = this.colorsHX[predictionIndex]; // "#00FFFF";
        const textWidth = ctx.measureText(prediction.label).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      });

      predictionsImage.forEach(prediction => {
        const x = prediction.x1;
        const y = prediction.y1;
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = '#000000';
        ctx.fillText(prediction.label, x, y);
      });
    });
  }

}
