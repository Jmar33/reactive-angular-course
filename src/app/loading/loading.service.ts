import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilComplete<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
