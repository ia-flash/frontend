import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { HttpClientModule } from '@angular/common/http';
import { SivnormComponent } from './sivnorm/sivnorm.component';
import { HomeComponent } from './home/home.component';
import { VideoComponent } from './video/video.component';
import { ImageDecodePipe } from './image-decode.pipe';
import { NguCarouselModule } from '@ngu/carousel';
import { GoogleAnalyticsService } from './google-analytics.service';


@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    SivnormComponent,
    HomeComponent,
    VideoComponent,
    ImageDecodePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NguCarouselModule
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
