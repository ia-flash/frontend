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
  uploadedVideo: any;
  burger = false;

  constructor(private predictionService: PredictionsService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.percent = -1;
    this.rotation90 = 0;
    this.classificationStatus = {
      loading: false,
      taskId: null
    };
    this.sliderValue = {
      probDetection: 50,
      probClassification: 85,
      fps: 3
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
    formData.append('probClassification', this.sliderValue.probClassification.toString());
    formData.append('probDetection', this.sliderValue.probDetection.toString());
    formData.append('fps', this.sliderValue.fps.toString());

    this.classificationStatus.loading = true;
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
    },
      error => {
        this.classificationStatus.loading = false;
        console.log(error);
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
        this.uploadedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      });

    }
  }

  getRotation() {
    if (this.rotation90 == 0) {
      return 'rotate(0deg)'
    } else if (this.rotation90 == 90) {
      return 'rotate(90deg)'
    } else if (this.rotation90 == 180) {
      return 'rotate(180deg)'
    } else if (this.rotation90 == 270) {
      return 'rotate(270deg)'
    }
  }

  onRotationSelected (selectedRotation) {
    this.rotation90 = selectedRotation;
    console.log(selectedRotation);
  }

  onFpsSelected (selectedFps) {
    this.sliderValue.fps = selectedFps;
    console.log(selectedFps);
  }

}
