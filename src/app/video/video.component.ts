import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  files: FileList;
  probabilities: any[];
  currentInput: any;
  imgCanvas: any; // {};
  percent: number;
  loadingClassification: boolean;
  result: any;
  rotation90: number;
  sliderValue: any;

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
    this.percent = -1;
  }

  videoIndex() {
    const formData: FormData = new FormData();
    if (this.files && this.files.length > 0) {
      Array.from(this.files).forEach(file => {
        formData.append('video', file, file.name);
      });
    }

    this.loadingClassification = true;
    console.log('here');
    this.predictionService.videoDetection(formData).subscribe(result => {
      console.log(result);
      this.updateProgress(result.task_id);
    },
      error => {
        this.loadingClassification = false;
        console.log(error);
      });
  }

  updateProgress(taskId) {
    this.predictionService.statusVideoDetection(taskId).subscribe(result => {
      console.log(result);
      this.result = result;
      this.percent = parseInt(result.current, 10) * 100 / parseInt(result.total, 10);
      console.log(this.percent);

      if (result['state'] != 'PENDING' && result['state'] != 'PROGRESS') {
        if ('result' in result) {
          this.loadingClassification = false;
          // show result
          console.log('Result: ' + result['result']);
        } else {
          // something unexpected happened
          console.log('Result: ' + result['state']);
        }
      } else {
        // rerun in 2 seconds
        setTimeout(() => {
          this.updateProgress(taskId);
        }, 2000);
      }



    });
  }

  onFileSelected(selectedFiles) {

    this.files = selectedFiles; // event.target.files;
    const files: FileList = selectedFiles; // event.target.files;
    console.log(files);
    if (files.length > 0) {
      this.probabilities = null;
      Array.from(files).forEach((file, index) => {
        this.currentInput = file; // .push(file.name);
      });

    }
  }

}
