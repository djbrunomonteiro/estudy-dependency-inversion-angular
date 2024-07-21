# Estudo de Caso sobre Dependency Inversion em Angular

Projeto em Angular 18 ! o conceito pode ser aplicado para versões anteriores.

A ideia é separar as regras de negócio do framework, ou seja, adaptar o Angular para usar as regras de negócio.

###     Estrutura de pasta

* app (framework)
* core (regras de negócio)


#### Resumindo

1. Criei uma classe abstrata com generics que pode receber ou não uma entrada e retornar ou não uma saída, com um método que deve ser implementado para executar a regra:

**/core/interfaces/userCase.ts**
```
export default abstract class UserCase<E, S> {
    abstract execute(implementation: E): Promise<S>;
}
```

2. Criei uma regra de negócio simples que tem como entrada um array de JSON e processará cada item realizando o parse. Nota: propositalmente, decidi usar uma classe que possui um método que faz essa conversão. Isso é útil para cenários como este, em que o caso de uso precisa de algo externo para sua execução.

**/core/Cases/usersParseJson.ts**

```
export class UsersParseJsonCase implements UserCase<any[], User[]>{

    constructor(private utils: UtilsService){ }

    async execute(users: any[]): Promise<User[]> {
        const usersParse = await users.map(elem => {
            const user = this.utils.parseJson(elem)
            return user
        })
        return usersParse
    }
    
}
```

3. Preparei o Angular para receber minha regra de negócio usando uma Factory. Como preciso prover a classe UtilsService ao usar a minha regra de negócio, preciso informar ao Angular como ele deve "fabricar" aquela classe e a dependência que ela usa. 

**src/app/views/users/users.component.ts**

```
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
```

obs: se sua regra de negócio precisa de mais injeções, deve seguir a ordem! Exemplo:

```
    {
      provide: SuaRegra,
      useFactory: (inject1: Inject1, inject2: Inject2, ..., inject5: Inject5) => {
        return new SuaRegra(inject1, inject2, ...,inject5 )
      },deps: [inject1, inject2, ...,inject5]
    }
```

4.  Executando a regra:

**src/app/views/users/users.component.ts**

```
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
```


Portanto, ao seguir essa abordagem, conseguimos manter nossas regras de negócio separadas do framework.

Se falei besteira, por favor me diga :)

brunomonteiroestudio@gmail.com


