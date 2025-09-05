import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'theme:dark';
  isDark = signal(true);

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved !== null ? saved === '1' : prefers;
    this.apply(initial);
  }

  toggle = () => { this.apply(!this.isDark()); }

  setDark = (v: boolean) => { this.apply(v); }

  apply = (v: boolean) => {
    this.isDark.set(v);
    const root = document.documentElement; // <html>
    root.classList.toggle('dark', v);
    localStorage.setItem(this.storageKey, v ? '1' : '0');
  }
}
