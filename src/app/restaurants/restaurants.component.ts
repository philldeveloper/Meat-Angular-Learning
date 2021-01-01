import { Component, OnInit } from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations'
import {FormBuilder, FormControl, FormGroup} from '@angular/forms'

import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantsService } from './restaurants.service';

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/from'
import {Observable} from 'rxjs/Observable'

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  animations: [
    trigger('toggleSearch',[
      state('hidden', style({
        opacity: 0,
        "max-height": "0px"
      })),
      state('visible', style({
        opacity: 1,
        "max-height": "70px"
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  searchBarState = 'hidden'
  restaurants: Restaurant[]

  searchForm: FormGroup
  searchControl: FormControl
  
  constructor(private restaurantsService: RestaurantsService,
              private fb: FormBuilder) {}

  ngOnInit() {

    this.searchControl = this.fb.control('')
    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    })

    // este observable se inscreve no input, de modo que cada alteração é chamada pelo serviço
    // EXEMPLO: this.searchControl.valueChanges.subscribe(searchTerm => console.log(searchTerm)) //

    this.searchControl.valueChanges
        .debounceTime(500) //esta funcao só permite a mensagem chegar pro user se a diferença entre dois events for maior que o tempo informado (nesse caso 500ms)
        .distinctUntilChanged() //estao funcao nao repete a chamada se a mensagem for igual a anterior durante o time setado no debounce
        .switchMap(searchTerm => 
          this.restaurantsService
            .restaurants(searchTerm)
            .catch(error=>Observable.from([])))
        .subscribe(restaurants => this.restaurants = restaurants) //o switchmap troca um observable de uma lista, para que ele possa ingressar em outra

    this.restaurantsService.restaurants()
      .subscribe(restaurants => this.restaurants = restaurants)
  }

  toggleSearch(){
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden'
  }

}
