import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    console.log("Loading service created...");
  }

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilComplete<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()), //Tap -> Cria um 'efeito colateral', método que é chamado em paralelo a emissão do observable
      concatMap(() => obs$), //Emite um novo observable no caso, com o mesmo valor do observable inicial
      finalize(() => this.loadingOff()) // Finalize -> call back que será chamada quando todos os observables forem concluídos ou retornarem algum erro
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
