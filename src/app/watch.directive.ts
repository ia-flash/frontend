import { Directive, HostListener } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Directive({
    selector: '[appWatch]'
})

export class WatchDirective {

  constructor(public googleAnalyticsService: GoogleAnalyticsService) {}

  @HostListener('window:blur', ['$event'])
  onWindowBlur(event: any): void {
    this.googleAnalyticsService.eventEmitter('home', 'watch', 'presentation', 0);
  }

}
