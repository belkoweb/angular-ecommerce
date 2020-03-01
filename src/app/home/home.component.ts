import { Component, OnInit } from '@angular/core';
import { Dish } from '../share/dish';
import { Promotion } from '../share/promotion';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../share/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  constructor(private dishservice: DishService, private promotionservice: PromotionService, private leaderservice: LeaderService) { }

  ngOnInit() {
   this.dishservice.getFeaturedDish().subscribe(dish =>  this.dish = dish);
   this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion );
   this.leaderservice.getFeaturedLeader().subscribe(leader => this.leader = leader);
  }

}
