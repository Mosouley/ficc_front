import { Directive, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[appNumberFormat]'
})
export class NumberFormatDirective {

  @Input('appNumberFormat') decimalPlaces: number = 2;

  constructor(private el: ElementRef, private control: NgControl) { }

  ngOnInit() {
    this.control.valueChanges?.subscribe(value => {
      if (value !== null) {
        this.control.control?.setValue(+value.toFixed(this.decimalPlaces), { emitEvent: false });
      }
    });
  }

}
