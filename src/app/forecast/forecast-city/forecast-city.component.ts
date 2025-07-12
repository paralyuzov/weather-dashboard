import { Component, inject, OnInit } from '@angular/core';
import { ForecastService } from '../forecast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import {
  DatePipe,
  DecimalPipe,
  AsyncPipe,
  KeyValuePipe,
} from '@angular/common';

@Component({
  selector: 'app-forecast-city',
  imports: [DatePipe, DecimalPipe, AsyncPipe, KeyValuePipe,Button],
  templateUrl: './forecast-city.component.html',
  styleUrl: './forecast-city.component.css',
})
export class ForecastCityComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  forecastService = inject(ForecastService);
  loading$ = this.forecastService.loading$;
  error$ = this.forecastService.error$;
  city: string | null = null;
  groupedForecast$ = this.forecastService.groupedForecast$;


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.city = params.get('city');
      if (this.city) {
        this.forecastService.loadForecast(this.city);
      }
    });
  }

  sortDays = (a: any, b: any) => {
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();

    const aIndex = dayOrder.indexOf(a.key);
    const bIndex = dayOrder.indexOf(b.key);

    const aOffset = (aIndex - today + 7) % 7;
    const bOffset = (bIndex - today + 7) % 7;

    return aOffset - bOffset;
  };

  goBack() {
    this.router.navigate(['/']);
  }
}
