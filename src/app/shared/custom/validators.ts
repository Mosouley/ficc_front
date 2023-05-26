import { AbstractControl, ValidatorFn } from '@angular/forms';

export function thousandsValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      console.log(value);

      return null;
    }
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return { 'thousands': { value: value } };
    }
    control.patchValue(parsedValue.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    return null;
  };
}


export function numberWithCommas(value: string | number): string {
  const numberValue = Number(value); // convert value to number
  console.log(' number value ' + numberValue);

  if (isNaN(numberValue)) return value.toString(); // return original value if not a valid number

  return numberValue.toLocaleString(); // add commas to number and return as string
}

