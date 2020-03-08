import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../share/dish';
import { Promotion } from '../share/promotion';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../share/leader';
import { flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class HomeComponent implements OnInit {
  dishErrMess: string;
  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  constructor(@Inject('BaseURL') public BaseURL,
              private dishservice: DishService, private promotionservice: PromotionService, private leaderservice: LeaderService) { }

  ngOnInit() {
   this.dishservice.getFeaturedDish().subscribe(dish =>  this.dish = dish, dishErrMess => this.dishErrMess = <any>dishErrMess);
   this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion );
   this.leaderservice.getFeaturedLeader().subscribe(leader => this.leader = leader);
  }

}
