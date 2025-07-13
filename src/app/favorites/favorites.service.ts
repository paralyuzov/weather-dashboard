import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'weather-favorites';
  private readonly MAX_FAVORITES = 10;

  toastService = inject(ToastService)
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
      this.toastService.showInfo(`Loaded ${favoritesArray.length} favorites from storage.`);
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      this.favoritesCitySubject.next([]);
      this.toastService.showError('Failed to load favorites from storage.');
    }
  }

  private saveFavoritesToStorage(favorites: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      this.toastService.showSuccess('Favorites saved successfully.');
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }

  addToFavorites(city: string): boolean {
    const currentFavorites = this.favoritesCitySubject.getValue();

    if (this.isFavorite(city)) {
      this.toastService.showWarn(`${city} is already in favorites.`);
      return false;
    }

    if (currentFavorites.length >= this.MAX_FAVORITES) {
      this.toastService.showError(`Maximum ${this.MAX_FAVORITES} favorites allowed`);
      return false;
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
    this.toastService.showInfo(`${city} removed from favorites.`);
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
