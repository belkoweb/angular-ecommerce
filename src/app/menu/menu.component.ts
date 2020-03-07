import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../share/dish';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  errMess: string;
  dishes: Dish[];

  constructor(private dishService: DishService, @Inject('BaseURL') public BaseURL)  { }

  ngOnInit(): void {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes, errmess => this.errMess = <any>errmess);
    // this.dishService.getDishes().subscribe(dishes => this.dishes = dishes);
  }

}
