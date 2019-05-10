import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  testPrediction() {
    return this.http.get(`${environment.api}`);
  }

  objectDection(formData: FormData | {}) {
    return this.http.post(`${environment.api}/object_detection`, formData);
  }

  classPrediction(formData: FormData) {
    return this.http.post<PredBox[]>(`${environment.api}/predict`, formData);
  }

  callSivnorm(marque, modele, tbRefname) {
    return this.http.get<SivnormResponse>(`${environment.sivnorm}/norm/${tbRefname}?marque=${marque}&modele=${modele}`);
  }

  callSivnormCsv(files, tbRefname) {
    const formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http.post(`${environment.sivnorm}/norm/${tbRefname}`, formData, {responseType: 'text'});
  }
}
