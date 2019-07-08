import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  objectDection(formData: FormData | {}, token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-API-KEY':  token
      })
    };
    return this.http.post<PredBox[]>(`/api/object_detection`, formData, httpOptions);
  }

  classPrediction(formData: FormData, token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-API-KEY':  token
      })
    };
    return this.http.post<PredBox[]>(`/api/predict`, formData, httpOptions);
  }

  login(token) {
    console.log({token});
    return this.http.post(`/api/login`, {token});
  }

  callSivnorm(marque, modele, tbRefname) {
    return this.http.get<SivnormResponse>(`/norm/${tbRefname}?marque=${marque}&modele=${modele}`);
  }

  callSivnormCsv(files, tbRefname) {
    const formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http.post(`/norm/${tbRefname}`, formData, {responseType: 'text'});
  }
}
