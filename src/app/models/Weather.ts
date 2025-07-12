export interface Weather {
  coord: Coordinates;
  weather: WeatherInfo[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: {
    all: number;
  };
  dt: number;
  sys: Sys;
  timezone?: number;
  id?: number;
  name?: string;
  cod?: number; // HTTP status code
}

export type Coordinates = {
  lat: number;
  lon: number;
};

export type WeatherInfo = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type Main = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
};

export type Wind = {
  speed: number;
  deg?: number;
  gust?: number;
};

export type Sys = {
  type?: number;
  id?: number;
  country?: string;
  sunrise?: number;
  sunset?: number;
};

export interface GeolocationCoord {
  latitude: number;
  longitude: number;
}
