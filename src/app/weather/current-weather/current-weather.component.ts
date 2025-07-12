import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Subject, takeUntil } from 'rxjs';
import { Weather } from '../../models/Weather';
import { CardModule } from 'primeng/card';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { WeatherSearchComponent } from '../weather-search/weather-search.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { TempratureConvertPipe } from '../../pipes/temprature-convert.pipe';
import { Router } from '@angular/router';
import { UserFavoritesComponent } from '../../favorites/user-favorites/user-favorites.component';
import { TooltipModule } from 'primeng/tooltip';
import { FavoritesService } from '../../favorites/favorites.service';

@Component({
  selector: 'app-current-weather',
  imports: [
    CardModule,
    DecimalPipe,
    DatePipe,
    AsyncPipe,
    Button,
    WeatherSearchComponent,
    ProgressSpinnerModule,
    ToggleSwitch,
    FormsModule,
    TempratureConvertPipe,
    UserFavoritesComponent,
    TooltipModule,
  ],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css',
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  weatherService = inject(WeatherService);
  favoritesService = inject(FavoritesService);
  currentWeather$ = this.weatherService.currentWeather$;
  loading$ = this.weatherService.loading$;
  error$ = this.weatherService.error$;
  switchTemp: boolean = false;
  router = inject(Router);

  private destroy$ = new Subject<void>();

  getTimeInMs(timestamp: number): number {
    return timestamp * 1000;
  }

  get temperatureUnit(): 'C' | 'F' {
    return this.switchTemp ? 'F' : 'C';
  }

  ngOnInit(): void {
    this.loadWeatherData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadWeatherData(): void {
    this.weatherService
      .getUserLocationWeather()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather: Weather) => {
          console.log('Weather loaded:', weather);
        },
        error: (error: string) => {
          console.error('Error loading weather:', error);
        },
      });
  }

  getLocalTime(dt: number, timezoneOffset: number): Date {
    return new Date((dt + timezoneOffset) * 1000);
  }

  retry(): void {
    this.loadWeatherData();
  }

  viewForecast(city: string): void {
    this.router.navigate(['/forecast', city]);
  }

  addToFavorites(city: string): void {
    const added = this.favoritesService.addToFavorites(city);
    if (added) {
      console.log(`${city} added to favorites.`);
    } else {
      console.warn(`${city} is already in favorites or could not be added.`);
    }
  }
}
