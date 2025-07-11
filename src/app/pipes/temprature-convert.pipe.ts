import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempratureConvert',
  standalone: true
})
export class TempratureConvertPipe implements PipeTransform {
  transform(
    value: number,
    unit: 'C' | 'F' = 'C',
    decimals: number = 0
  ): string {
    if(value === null || value === undefined || isNaN(value)) {
      return '--'
    }

    let convertedValue: number;
    let unitSymbol: string;
    if(unit === 'F') {
      convertedValue = (value * 9) / 5 + 32;
      unitSymbol = '°F';
    } else {
      convertedValue = value;
      unitSymbol = '°C';
    }

    return `${convertedValue.toFixed(decimals)}${unitSymbol}`;
  }
}
