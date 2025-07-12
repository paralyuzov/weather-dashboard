import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FavoritesService } from '../favorites.service';
import { AsyncPipe } from '@angular/common';
import { WeatherService } from '../../weather/weather.service';

@Component({
  selector: 'app-user-favorites',
  imports: [CardModule, Button, TooltipModule, AsyncPipe],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.css',
})
export class UserFavoritesComponent {
  favoritesService = inject(FavoritesService);
  weatherService = inject(WeatherService);
  favoritesCity$ = this.favoritesService.favoritesCity$;

  removeFavorite(city: string): void {
    this.favoritesService.removeFromFavorites(city);
  }

  loadCityWeather(city: string): void {
    this.weatherService.getWeatherByCity(city).subscribe({
      next: (weather) => {
        if (weather) {
          console.log(`Weather loaded for ${city}:`, weather);
        }
      },
      error: (error) => {
        console.error(`Error loading weather for ${city}:`, error);
      },
    });
  }
}
