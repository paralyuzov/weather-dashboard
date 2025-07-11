import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    loadComponent: () =>
      import('./weather/current-weather/current-weather.component').then(
        (m) => m.CurrentWeatherComponent
      ),
  },
];
