import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PredBox } from './predbox';

export interface SivnormResponse {
  marque: string;
  modele: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  constructor(private http: HttpClient) { }

  imageAnonymisation(formData: FormData | {}) {
    return this.http.post<PredBox[]>(`/matchvec/anonym`, formData);
  }

  objectDection(formData: FormData | {}) {
    return this.http.post<PredBox[]>((environment.apiMatchvec ? environment.apiMatchvec : '/matchvec') + `/object_detection`, formData);
  }

  videoDetection(formData: FormData | {}) {
    return this.http.post<any>(`/matchvec/video_detection`, formData);
  }

  killTaskVideo(taskId) {
    return this.http.get<any>(`/matchvec/killtask/${taskId}`);
  }

  statusVideoDetection(taskId) {
    return this.http.get<any>(`/matchvec/status/${taskId}`);
  }

  classPrediction(formData: FormData) {
    return this.http.post<PredBox[]>((environment.apiMatchvec ? environment.apiMatchvec : '/matchvec') + `/predict`, formData);
  }

  callSivnorm(marque, modele, tbRefname) {
    return this.http.get<SivnormResponse>((environment.apiSivnorm ? environment.apiSivnorm : '/sivnorm') + `/norm/${tbRefname}?marque=${marque}&modele=${modele}`);
  }

  callSivnormCsv(files, tbRefname) {
    const formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
    const req = new HttpRequest('POST', (environment.apiSivnorm ? environment.apiSivnorm : '/sivnorm') + `/norm/${tbRefname}`, formData, {
      responseType: 'text',
      reportProgress: true
    });
    return this.http.request(req);

  }
}
