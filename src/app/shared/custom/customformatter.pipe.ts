import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customformatter',
    standalone: true
})
export class CustomformatterPipe implements PipeTransform {

  transform(value: string, ...args: any[]) {
    const format = args[0] ? '2.0-2' : '3.2-2';
    return this.decimalPipe.transform(value, format);
  }
  constructor(private decimalPipe: DecimalPipe) {}

}
