import { UtilsService } from "../../app/services/utils.service";
import { User } from "../interfaces/user";
import UserCase from "../interfaces/userCase";


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