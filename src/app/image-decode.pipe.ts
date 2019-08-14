import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imageDecode'
})
export class ImageDecodePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + value);
  }

}
