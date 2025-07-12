import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    loadComponent: () =>
      import('./weather/current-weather/current-weather.component').then(
        (m) => m.CurrentWeatherComponent
      ),
  },
  {
    path: 'forecast/:city',
    loadComponent: () =>
      import('./forecast/forecast-city/forecast-city.component').then(
        (m) => m.ForecastCityComponent
      ),
  }
];
