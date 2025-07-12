import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'weather-favorites';
  private readonly MAX_FAVORITES = 10;

  private favoritesCitySubject = new BehaviorSubject<string[]>([]);
  favoritesCity$ = this.favoritesCitySubject.asObservable();

  constructor() {
    this.loadFavoritesFromStorage();
  }

  private loadFavoritesFromStorage(): void {
    try {
      const favorites = localStorage.getItem(this.STORAGE_KEY);
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      this.favoritesCitySubject.next(favoritesArray);
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      this.favoritesCitySubject.next([]);
    }
  }

  private saveFavoritesToStorage(favorites: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }

  addToFavorites(city: string): boolean {
    const currentFavorites = this.favoritesCitySubject.getValue();

    if (this.isFavorite(city)) {
      return false;
    }

    if (currentFavorites.length >= this.MAX_FAVORITES) {
      throw new Error(`Maximum ${this.MAX_FAVORITES} favorites allowed`);
    }

    const updatedFavorites = [...currentFavorites, city];
    this.favoritesCitySubject.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
    return true;
  }

  removeFromFavorites(city: string): boolean {
    const currentFavorites = this.favoritesCitySubject.getValue();
    const updatedFavorites = currentFavorites.filter(fav =>
      fav.toLowerCase() !== city.toLowerCase()
    );

    if (updatedFavorites.length === currentFavorites.length) {
      return false;
    }

    this.favoritesCitySubject.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
    return true;
  }

  isFavorite(city: string): boolean {
    const currentFavorites = this.favoritesCitySubject.getValue();
    return currentFavorites.some(fav =>
      fav.toLowerCase() === city.toLowerCase()
    );
  }

  getFavorites(): string[] {
    return this.favoritesCitySubject.getValue();
  }

  getFavoritesCount(): number {
    return this.favoritesCitySubject.getValue().length;
  }

  clearAllFavorites(): void {
    this.favoritesCitySubject.next([]);
    this.saveFavoritesToStorage([]);
  }

  toggleFavorite(city: string): boolean {
    if (this.isFavorite(city)) {
      return !this.removeFromFavorites(city);
    } else {
      return this.addToFavorites(city);
    }
  }
}
