import { Injectable } from '@angular/core';
import { environment } from '../../environment/enviroment.local';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get openWeatherApi(): string {
    return environment.openWeatherApi;
  }

  get openWeatherBaseUrl(): string {
    return environment.openWeatherBaseUrl;
  }
}
