import { Component, OnInit, inject, signal } from '@angular/core';
import { ExempleService } from '../../services/exemple.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import {UsersParseJsonCase} from '../../../core/cases/usersParseJson';
import { User } from '../../../core/interfaces/user';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: UsersParseJsonCase,
      useFactory: (utils: UtilsService) => {
        return new UsersParseJsonCase(utils)
      },deps: [UtilsService]
    }
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  //obtendo a referência de sua regra
  usersParseJsonCase = inject(UsersParseJsonCase);

  exempleService = inject(ExempleService);
  users = signal<User[]>([]);
  ngOnInit(): void {
    this.getUsers();
  }
  async getUsers(){
    const {results} = await firstValueFrom(this.exempleService.getUsers());
    //Executando sua regra
    const users = await this.usersParseJsonCase.execute(results)
    this.users.set(users)
  }
}
