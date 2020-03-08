import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../share/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Feedback, ContactType } from '../share/feedback';
import { Comment } from '../share/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {
 visibility = 'shown';
  dishcopy: Dish;
  dishErrMess: string;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  @ViewChild('fform') feedbackFormDirective;
  feedbackForm: FormGroup;
  feedback: any;
  formErrors = {
    author: '',
    comment: ''
  };
  validationMessages = {
    author: {
      required: 'Name is required.',
      minlength: 'Name must be at least 2 characters long.',
      maxlength: 'Name cannot be more than 25 characters long.'
    },
    comment: {
      required: 'Message is required.',
      minlength: 'Message must be at least 2 characters long.',
      maxlength: 'Message cannot be more than 1500 characters long.'
    }
  };

  constructor(@Inject('BaseURL') public BaseURL,
              private dishservice: DishService, private route: ActivatedRoute, private location: Location, private fb: FormBuilder) {
    this.createForm();
  }

ngOnInit() {

  this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds, dishErrMess => this.dishErrMess =  dishErrMess as any);
  /*this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
  .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });*/
 /* this.route.params
      .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
        errmess => this.dishErrMess = <any>errmess );*/
  this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden';
                                                         return this.dishservice.getDish(+params.id); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish;
                         this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => this.dishErrMess =  errmess as any);
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
  const comment: Comment = {
    rating:  this.feedback.rating,
    comment: this.feedback.comment,
    author: this.feedback.author,
    date: new Date().toISOString()
    };
  this.dishcopy.comments.push(comment);
  this.dishservice.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
    errmess => { this.dish = null; this.dishcopy = null; this.dishErrMess =  errmess as any; });

  /*
  this.dish.comments.push({
    rating: this.feedback.rating,
    comment: this.feedback.comment,
    author: this.feedback.author,
    date: new Date().toISOString()
    });*/
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
