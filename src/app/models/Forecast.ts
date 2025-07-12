import { WeatherInfo, Wind, Coordinates } from './Weather';

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: CityInfo;
}

export interface ForecastItem {
  dt: number;
  main: ForecastMain;
  weather: WeatherInfo[];
  clouds: {
    all: number;
  };
  wind: Wind;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
  rain?: {
    '3h': number;
  };
  snow?: {
    '3h': number;
  };
}

export interface ForecastMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface CityInfo {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface DailyForecast {
  date: string;
  forecasts: ForecastItem[];
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  dominantWeather: WeatherInfo;
}

export interface GroupedForecastByDay {
  [dayOfWeek: string]: ForecastItem[];
}
