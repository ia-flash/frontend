import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';
import { PredBox } from '../predbox';
import { environment } from '../../environments/environment';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

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
  image_url = '';
  invalidUrl = '';
  loading: boolean;
  progress: number;
  progress_message: string;
  colors: string[] = ['is-primary', 'is-danger', 'is-warning',"is-link", "is-info", "is-success"]
  colorsHX: string[] = ['#253e7c', '#DC5379', '#d8ac1c', '#264BEC', "#00BFFF","#17981a"]
  selectedTab: string;
  burger = false;
  gpu = environment.gpu;
  clasif_key: string;

  constructor(
    private predictionService: PredictionsService,
    public googleAnalyticsService: GoogleAnalyticsService
  ){ }

  ngOnInit() {
    this.selectedTab = 'preview';
    this.imgCanvas = {};
    this.currentInput = {};
    this.onInputUrlChange();
  }

  toggleBurger() {
    this.burger = !this.burger;
  }

  onInputUrlChange() {
    if (this.image_url) {
      if (this.image_url.match(/\.(jpeg|jpg)$/) != null) {
        this.invalidUrl = '';
        this.currentInput[0] = {name: this.image_url, size: null};
        const image = new Image();
        image.src = this.image_url;
        this.imgCanvas[0] = image;
        image.onload = () => {
          const canvas = document.getElementById(`canvas${0}`) as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');
          canvas.width  = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0, image.width, image.height);
        };
      } else {
        this.invalidUrl = "l'url doit finir en jpg/jpeg";
      }
    }
  }

  onFileSelected(selectedFiles) {
    this.invalidUrl = '';
    this.files = selectedFiles;
    const files: FileList = selectedFiles;
    if (files.length > 0) {
      this.probabilities = null;
      Array.from(files).forEach((file, index) => {
        this.currentInput[index + 1] = {name: file.name, size: (file.size/ 1000000)};
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
    if (this.image_url) {
      formData.append('url', this.image_url);
    }
    if (this.files && this.files.length > 0) {
      Array.from(this.files).forEach(file => {
        formData.append('image', file, file.name);
      });
    }
    return formData;
  }

  drawAnonymisation() {
    this.loading = true;
    console.log(this.image_url);

    const formData = this.addAttachementsToForm();

    this.predictionService.imageAnonymisation(formData).subscribe(result => {
      console.log(result);
      this.loading = false;
      if (result.length > 0) {
        this.renderAnonymisation(result);
      } else {
        this.invalidUrl = "Nothing to anonymyse";
      }
    },
      error => {
        this.loading = false;
        console.log(error);
        this.invalidUrl = "Error in prediction";
      });

  }


  drawDetection() {
    this.loading = true;
    const formData = this.addAttachementsToForm();
    const startTime = new Date();
    this.predictionService.objectDection(formData).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.progress_message = "Test de connection 📡"
            break;
          case HttpEventType.ResponseHeader:
            this.progress_message = "Bonne connection ✔️"
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            if (this.progress == 100) {
              this.progress_message = "Calculating 🧠";
            } else {
              this.progress_message = "Uploading image 📨";
            }
            break;
          case HttpEventType.Response:
            this.loading = false;
            const endTime = new Date();
            let timeDiff = + endTime - (+startTime);
            timeDiff /= 1000;
            this.progress_message = `Fait au bout de ${timeDiff.toFixed(1)} secondes`;
            setTimeout(()=>{
              this.progress = null;
            }, 3000);
            if (event.body.length > 0) {
              this.googleAnalyticsService.eventEmitter("matchvec", "api", "objectDection", event.body.length);
              this.renderPredictions(event.body, "");
            } else {
              this.googleAnalyticsService.eventEmitter("matchvec", "api", "objectDection", 0);
              this.invalidUrl = 'No image ?';
            }
        }
      }, error => {
        this.loading = false;
        this.progress = null;
        console.log(error);
        this.invalidUrl = 'Error in prediction';
        this.googleAnalyticsService.eventEmitter("matchvec", "error", "objectDection", 1);
      });

  }


  drawPrediction(key) {
    this.loading = true;
    this.clasif_key = key
    const formData = this.addAttachementsToForm();
    const startTime = new Date();
    this.predictionService.classPrediction(formData).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.progress_message = "Test de connection 📡"
            break;
          case HttpEventType.ResponseHeader:
            this.progress_message = "Bonne connection ✔️"
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            if (this.progress == 100) {
              this.progress_message = "Calculating 🧠";
            } else {
              this.progress_message = "Uploading image 📨";
            }
            break;
          case HttpEventType.Response:
            this.loading = false;
            const endTime = new Date();
            let timeDiff = + endTime - (+startTime);
            timeDiff /= 1000;
            this.progress_message = `Fait au bout de ${timeDiff.toFixed(1)} secondes`;
            setTimeout(()=>{
              this.progress = null;
            }, 3000);
            console.log(event.body)
            this.probabilities = event.body;
            if (event.body.length > 0) {
              this.googleAnalyticsService.eventEmitter("matchvec", "api", "classification", event.body.length);
              this.renderPredictions(event.body, key);
            } else {
              this.googleAnalyticsService.eventEmitter("matchvec", "api", "classification", 0);
              this.invalidUrl = 'No image ?';
            }
        }
    }, error => {
      this.googleAnalyticsService.eventEmitter("matchvec", "error", "classification", 1);
      this.loading = false;
      this.progress = null;
      console.log(error);
      this.invalidUrl = 'Error in prediction';
    });
  }

  renderAnonymisation = (predictions) => {
    predictions.forEach((predictionsImage, index) => {
      console.log('Predictions', predictionsImage);
      const canvas = document.getElementById(`canvas${this.image_url ? index : index + 1}`) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      canvas.width  = this.imgCanvas[this.image_url ? index : index + 1].width;
      canvas.height = this.imgCanvas[this.image_url ? index : index + 1].height;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Font options.
      const font = '16px sans-serif';
      ctx.font = font;
      ctx.textBaseline = 'top';
      ctx.drawImage(this.imgCanvas[this.image_url ? index : index + 1], 0, 0,
        this.imgCanvas[this.image_url ? index : index + 1].width, this.imgCanvas[this.image_url ? index : index + 1].height);

      if (predictionsImage && predictionsImage.length === 0 && this.imgCanvas.length > 0) {
        const textWidth = ctx.measureText("Pas de prediction").width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, textWidth + 4, textHeight + 4);
        ctx.strokeStyle = this.colorsHX[0]; // "#00FFFF";
        ctx.fillStyle = this.colorsHX[0]; // "#00FFFF";
        ctx.fillText("Pas de prediction", 0, 0);
      }

      predictionsImage.forEach((prediction, predictionIndex) => {
        const x = prediction.x1;
        const y = prediction.y1;
        const width = prediction.x2 - prediction.x1;
        const height = prediction.y2 - prediction.y1;
        if (prediction.class_name == 'band') {
          ctx.filter = `blur(5px)`;
          ctx.drawImage(this.imgCanvas[this.image_url ? index : index + 1], x, y,
            width, height, x, y, width, height);
        } else {
          const std = width/20;
          ctx.filter = `blur(${std}px)`;
          ctx.drawImage(this.imgCanvas[this.image_url ? index : index + 1], x-std, y-std,
            width+(2*std), height+(2*std), x-std, y-std, width+(2*std), height+(2*std));
        }
      });

    });
  }

  renderPredictions = (predictions, key) => {
    console.log(key);
    predictions.forEach((predictionsImage, index) => {
      console.log('Predictions', predictionsImage);
      const canvas = document.getElementById(`canvas${this.image_url ? index : index + 1}`) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      canvas.width  = this.imgCanvas[this.image_url ? index : index + 1].width;
      canvas.height = this.imgCanvas[this.image_url ? index : index + 1].height;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Font options.
      const font = '16px sans-serif';
      ctx.font = font;
      ctx.textBaseline = 'top';
      ctx.drawImage(this.imgCanvas[this.image_url ? index : index + 1], 0, 0,
        this.imgCanvas[this.image_url ? index : index + 1].width, this.imgCanvas[this.image_url ? index : index + 1].height);

      if (predictionsImage && predictionsImage.length === 0 && this.imgCanvas.length > 0) {
        const textWidth = ctx.measureText("Pas de prediction").width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, textWidth + 4, textHeight + 4);
        ctx.strokeStyle = this.colorsHX[0]; // "#00FFFF";
        ctx.fillStyle = this.colorsHX[0]; // "#00FFFF";
        ctx.fillText("Pas de prediction", 0, 0);
      }

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
        const textWidth = ctx.measureText(prediction[key].label).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Draw the text last to ensure it's on top.
        ctx.fillStyle = '#ffffff';
        ctx.fillText(prediction[key].label, x, y);
      });
    });
  }

}
