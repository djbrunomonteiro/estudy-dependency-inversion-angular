import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExempleService {

  http = inject(HttpClient);

  getUsers(){
    return this.http.get('https://jsonplaceholder.typicode.com/users')
    .pipe(map((res: any) => {
      return {status: res?.status ?? 200, results: res.map((elem: any) => JSON.stringify(elem))}
    }))
  }



}
