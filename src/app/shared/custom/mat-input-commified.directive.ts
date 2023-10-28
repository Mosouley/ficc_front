
import { Directive, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { numberWithCommas } from './validators';

@Directive({
  selector: 'input[MatInputCommified]',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR,
       useExisting: MatInputCommifiedDirective },
       {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MatInputCommifiedDirective),
        multi: true,
      }]
})
export class MatInputCommifiedDirective {
  private _value!: string | null;
  constructor( private elementRef: ElementRef<HTMLInputElement>) {
    console.log('created directive');

   }

  get value(): string | null { return this._value; }

  @Input('value')
  set value(value: string | null) {
     this._value = value;
     this.formatValue(value)
     console.log( this._value );

     }

    private formatValue(value: string | null) {
      if(value !== null) {
        this.elementRef.nativeElement.value = numberWithCommas(value)

    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this._value = value.replace(/[^\d.-]/g, '');
    if (value) {
      this.elementRef.nativeElement.value = this._value;
    } else {
      this.elementRef.nativeElement.value = ''
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // here we cut any non numerical symbols
    // control.patchValue(parsedValue.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    this._value = value.replace(/[^\d.-]/g, '');
    this._onChange(this._value); // here to notify Angular Validators
  }

  @HostListener('blur')
  _onBlur() {
    this.formatValue(this._value); // add commas
  }

  @HostListener('focus')
  onFocus() {
    this.unFormatValue(); // remove commas for editing purpose
  }

  _onChange(value: any): void {
  }

  writeValue(value: any) {
    this._value = value;
    this.formatValue(this._value); // format Value
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched() {
  }

}
