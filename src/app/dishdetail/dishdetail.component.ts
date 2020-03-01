import { Component, OnInit } from '@angular/core';
import { Dish } from '../share/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  constructor(private dishservice: DishService, private route: ActivatedRoute, private location: Location) {
}

ngOnInit() {
  // tslint:disable-next-line: no-string-literal
  const id = this.route.snapshot.params['id'];
  this.dishservice.getDish(id).subscribe(dish => this.dish = dish);
}

goBack(): void {
  this.location.back();
}

}
