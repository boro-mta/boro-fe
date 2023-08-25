import { ICoordinate } from "../types";

export class AddressesCache {
  private localStorageKey: string;
  private map: Map<string, string>;

  constructor(localStorageKey: string) {
    this.localStorageKey = localStorageKey;
    const fromLocalStorage = localStorage.getItem(localStorageKey);
    if (fromLocalStorage) {
      const parsedData = JSON.parse(fromLocalStorage);
      this.map = new Map<string, string>(Object.entries(parsedData));
    } else {
      this.map = new Map<string, string>();
    }
  }

  private parseKey({ latitude, longitude }: ICoordinate): string {
    return `${latitude},${longitude}`;
  }

  private save(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.map));
  }

  set(key: ICoordinate, value: string): void {
    const p = this.parseKey(key);
    if (this.map.has(p)) {
      return;
    }
    this.map.set(p, value);
    this.save();
  }

  get(key: ICoordinate): string | undefined {
    const p = this.parseKey(key);
    return this.map.get(p);
  }
}

export const addressesCache = new AddressesCache("addressesCache");
