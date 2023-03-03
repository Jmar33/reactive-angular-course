import { AfterViewInit, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { CoursesSerive } from "../service/courses.service";
import { LoadingService } from "../loading/loading.service";
import { catchError } from "rxjs/operators";
import { MessagesService } from "../messages/messages.service";
import { throwError } from "rxjs";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesSerive,
    private loadingSevice: LoadingService,
    private messageService: MessagesService
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });

    // loadingSevice.loadingOn();
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;

    const saveCourses$ = this.coursesService
      .saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save the course";
          console.log(message, err);
          this.messageService.showErrors(message);
          return throwError(err);
        })
      );

    this.loadingSevice
      .showLoaderUntilComplete(saveCourses$)
      .subscribe((val) => {
        this.dialogRef.close(val);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
