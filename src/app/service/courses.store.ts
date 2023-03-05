import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MessagesService } from "../messages/messages.service";
import { LoadingService } from "../loading/loading.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  //A melhor forma de criarmos um observable é através de um subject privado
  //Essa abordagem facilita a criação de um app com gerenciamento de estado
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessagesService,
    private loadingService: LoadingService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        console.log(message, err);
        this.messageService.showErrors(message);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilComplete(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex((course) => course.id == courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        console.log(message, err);
        this.messageService.showErrors(message);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
