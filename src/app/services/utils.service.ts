import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  parseJson(item: string){
    return JSON.parse(item)
  }
}
