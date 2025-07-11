import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { WeatherService } from '../weather.service';
import { Button } from "primeng/button";


@Component({
  selector: 'app-weather-search',
  imports: [FloatLabel, InputTextModule, FormsModule, Button],
  templateUrl: './weather-search.component.html',
  styleUrl: './weather-search.component.css',
})
export class WeatherSearchComponent {
  weatherService = inject(WeatherService);
  searchCity: string = '';

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement.value;
    if (!searchValue) {
      return;
    }
    this.searchCity = searchValue.trim();
  }

  onSearch(inputElement: HTMLInputElement): void {
    if (this.searchCity) {
      this.weatherService.getWeatherByCity(this.searchCity).subscribe();
      this.searchCity = ""
      inputElement.value = "";
    }
  }
}
