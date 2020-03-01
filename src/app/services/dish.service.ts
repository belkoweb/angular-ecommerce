import { Injectable } from '@angular/core';
import { Dish } from '../share/dish';
import { DISHES } from '../share/dishes';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }
  getDish(id: string): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => (dish.id === id))[0]);
  }

  getFeaturedDish(): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => dish.featured)[0]);
  }

 getDishes(): Promise<Dish[]> {
    return Promise.resolve(DISHES);
  }
}
