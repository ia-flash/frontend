import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../predictions.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  classificationStatus: any;
  result: any;
  rotation90: number;
  sliderValue: any;
  selectedTab: string;
  burger = false;

  constructor(private predictionService: PredictionsService) { }

  ngOnInit() {
    this.percent = -1;
    this.rotation90 = 0;
    this.classificationStatus = {
      loading: false,
      taskId: null
    };
    this.sliderValue = {
      x1: 0,
      x2: 100,
      y1: 0,
      y2: 100
    };
    this.selectedTab = 'video';
  }

  toggleBurger() {
    this.burger = !this.burger;
  }

  videoIndex() {
    const formData: FormData = new FormData();
    if (this.files && this.files.length > 0) {
      Array.from(this.files).forEach(file => {
        formData.append('video', file, file.name);
      });
    }
    formData.append('rotation', this.rotation90.toString());

    for (const [key, value] of Object.entries(this.sliderValue)) {
      formData.append(`crop_coord_${key}`, value.toString());
    }

    this.classificationStatus.loading = true;
    console.log('here');
    this.predictionService.videoDetection(formData).subscribe(result => {
      console.log(result);
      this.classificationStatus.taskId = result.task_id;
      this.updateProgress(result.task_id);
    },
      error => {
        this.classificationStatus.loading = false;
        console.log(error);
      });
  }

  killTask() {
    this.predictionService.killTaskVideo(this.classificationStatus.taskId).subscribe(result => {
      console.log(result);
      this.classificationStatus = {
        loading: false,
        taskId: null
      };
      this.percent = -1;
    });
  }

  updateProgress(taskId) {
    this.predictionService.statusVideoDetection(taskId).subscribe(result => {
      console.log(result);
      this.result = result;
      this.percent = parseInt(result.current, 10) * 100 / parseInt(result.total, 10);
      console.log(this.percent);

      if (result.state !== 'PENDING' && result.state !== 'PROGRESS') {
        if ('result' in result) {
          this.classificationStatus.loading = false;
          // show result
          console.log('Result: ' + result.result);
        } else {
          // something unexpected happened
          console.log('Result: ' + result.state);
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
