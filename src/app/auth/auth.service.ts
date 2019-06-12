import { Injectable } from '@angular/core';
import {of, Observable} from 'rxjs';
import {delay, tap} from 'rxjs/operators';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user:User = null;
  public redirectUrl:string = null;

  constructor() {
    this.user = JSON.parse(localStorage.getItem("user"));
   }

  login():Observable<User>{
    return of({name:"Peter", email:"peter@gmail.com", token:"123456789"}).pipe(
      delay(750),
      tap(user => this.user = user),
      tap(user => localStorage.setItem("user", JSON.stringify(user)))
    );
  }

  logout(){
    this.user = null;
    localStorage.removeItem("user");
  }
}
