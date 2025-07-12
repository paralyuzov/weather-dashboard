import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, reduce } from 'rxjs';
import { ForecastResponse, GroupedForecastByDay } from '../models/Forecast';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private configService = inject(ConfigService);
  private http = inject(HttpClient);
  private api = this.configService.openWeatherBaseUrl;
  private apiKey = this.configService.openWeatherApi;

  private currentForeCastSubject = new BehaviorSubject<ForecastResponse | null>(null);
  currentForecast$ = this.currentForeCastSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();
  private groupedForecastSubject = new BehaviorSubject<GroupedForecastByDay | null>(null);
  groupedForecast$ = this.groupedForecastSubject.asObservable();

  constructor() {}

  private getForecastByCity(city: string): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(
      `${this.api}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
    );
  }

  private groupForecastByDay(forecast: ForecastResponse): Record<string, any[]> {
    return forecast.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = [];
      }

      acc[dayOfWeek].push(item);
      return acc;
    }, {} as GroupedForecastByDay);
  }

  loadForecast(city: string) {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.getForecastByCity(city).subscribe({
      next: (response) => {
        this.currentForeCastSubject.next(response);
        const groupedForecast = this.groupForecastByDay(response);
        this.groupedForecastSubject.next(groupedForecast);
        console.log('Forecast grouped by day:', groupedForecast);
        console.log('Forecast loaded:', response);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next(error);
        this.loadingSubject.next(false);
      },
    });
  }
}
