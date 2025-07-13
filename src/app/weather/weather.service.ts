import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { GeolocationCoord, Weather } from '../models/Weather';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { switchMap, catchError, finalize, tap } from 'rxjs/operators';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private api = this.configService.openWeatherBaseUrl;
  private apiKey = this.configService.openWeatherApi;
  private toastService = inject(ToastService);

  private currentWeatherSubject = new BehaviorSubject<Weather | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  currentWeather$ = this.currentWeatherSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  getUserLocationWeather(): Observable<Weather> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.getUserCoordinates().pipe(
      switchMap(coords => this.getCurrentWeather(coords.latitude, coords.longitude)),
      tap(weather => {
        this.currentWeatherSubject.next(weather);
        this.toastService.showSuccess('Weather loaded successfully!');
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.errorSubject.next(error);
        this.toastService.showError(error);
        return throwError(() => error);
      })
    );
  }

  private getUserCoordinates(): Observable<GeolocationCoord> {
    return new Observable<GeolocationCoord>((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permission denied. Please allow location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get your location timed out.';
              break;
          }
          observer.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }

  private getCurrentWeather(lat: number, lon: number): Observable<Weather> {
    const url = `${this.api}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<Weather>(url);
  }

  getWeatherByCity(city: string): Observable<Weather | null> {
  this.loadingSubject.next(true);
  this.errorSubject.next(null);

  const url = `${this.api}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
  return this.http.get<Weather>(url).pipe(
    tap(weather => {
      this.currentWeatherSubject.next(weather);
      this.errorSubject.next(null);
      this.toastService.showSuccess(`Weather for ${city} loaded successfully!`);
    }),
    finalize(() => {
      this.loadingSubject.next(false);
    }),
    catchError(error => {
      let errorMessage = 'City not found. Please check the spelling and try again.';

      if (error.status === 404) {
        errorMessage = `"${city}" not found. Please try a different city name.`;
      } else if (error.status === 401) {
        errorMessage = 'API key invalid. Please contact support.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      }

      this.errorSubject.next(errorMessage);
      this.currentWeatherSubject.next(null);
      this.toastService.showError(errorMessage);

      return of(null);
    })
  );
}
}
