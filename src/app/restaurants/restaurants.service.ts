import {Injectable, Inject} from '@angular/core'
import {Http} from '@angular/http'

import {Observable} from 'rxjs/Observable'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import {Restaurant} from "./restaurant/restaurant.model"
import {MenuItem} from '../restaurant-detail/menu-item/menu-item.model'

import{MEAT_API} from '../app.api'
import {ErrorHandler} from '../app.error-handler'


@Injectable()
export class RestaurantsService {

    constructor(private http: Http){}

    /* o paramento 'q:search' indica que basicamente qualquer atributo de restaurant
    pode ser pesquisado, facilitando o campo de busca */

    /* (search?:string) indica que esse metodo é opcional, logo qualquer função que esteja
    chamando restaurants nao precisa obrigatoriamente passar uma string */
    
    restaurants(search?: string): Observable<Restaurant[]>{
        return this.http.get(`${MEAT_API}/restaurants`, {params: {q: search}})
        .map(response => response.json())
        .catch(ErrorHandler.handleError)
    }

    restaurantById(id: string): Observable<Restaurant>{
        return this.http.get(`${MEAT_API}/restaurants/${id}`)
        .map(response => response.json())
        .catch(ErrorHandler.handleError)
    }

    reviewsOfRestaurant(id: string): Observable<any>{
        return this.http.get(`${MEAT_API}/restaurants/${id}/reviews`)
        .map(response => response.json())
        .catch(ErrorHandler.handleError)
    }

    menuOfRestaurant(id: string): Observable<MenuItem[]>{
        return this.http.get(`${MEAT_API}/restaurants/${id}/menu`)
        .map(response => response.json())
        .catch(ErrorHandler.handleError)
    }


}