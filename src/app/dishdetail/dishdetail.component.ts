import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../share/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Feedback, ContactType } from '../share/feedback';
import { Comment } from '../share/comment';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  @ViewChild('fform') feedbackFormDirective;
  feedbackForm: FormGroup;
  feedback: any;
  formErrors = {
    'author': '',
    'comment': ''
  };
  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Message is required.',
      'minlength': 'Message must be at least 2 characters long.',
      'maxlength': 'Message cannot be more than 1500 characters long.'
    }
  };

  constructor(@Inject('BaseURL') public BaseURL,
              private dishservice: DishService, private route: ActivatedRoute, private location: Location, private fb: FormBuilder) {
    this.createForm();
  }

ngOnInit() {

  this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
  this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
  .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
}

createForm() {
  this.feedbackForm = this.fb.group({
    rating: 5,
    comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
  });

  this.feedbackForm.valueChanges
  .subscribe(data => this.onValueChanged(data));
  this.onValueChanged();

}

onValueChanged(data?: any) {
  if (!this.feedbackForm) { return; }
  const form = this.feedbackForm;
  for (const field in this.formErrors) {
    if (this.formErrors.hasOwnProperty(field)) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }
}

onSubmit() {
  this.feedback = this.feedbackForm.value;
  this.dish.comments.push({
    rating: this.feedback.rating,
    comment: this.feedback.comment,
    author: this.feedback.author,
    date: new Date().toISOString()
    });
  this.feedbackFormDirective.resetForm();
  this.feedbackForm.reset({
    rating: 5,
    comment: '',
    author: ''
  });

}

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
goBack(): void {
  this.location.back();
}


}
