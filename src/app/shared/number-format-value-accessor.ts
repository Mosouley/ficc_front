import { DecimalPipe } from "@angular/common";
import { FormControl, ValidatorFn } from "@angular/forms";

export function NumberFormatValueAccessor(options: { numberFormat?: string } = {}): ValidatorFn {
  const decimalPipe = new DecimalPipe();
  const numberFormat = options.numberFormat || '1.0-2';

    return (control: FormControl<any>) => {
      if (!control.value) {
        return null;
      }

      const formattedValue = decimalPipe.transform(control.value, numberFormat);

      if (control.value !== formattedValue) {
        control.setValue(formattedValue);
      }

      return null;
    };
}
