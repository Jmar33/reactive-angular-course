import { AfterViewInit, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { CoursesSerive } from "../service/courses.service";
import { LoadingService } from "../loading/loading.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesSerive,
    private loadingSevice: LoadingService
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

    const saveCourses$ = this.coursesService.saveCourse(
      this.course.id,
      changes
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
