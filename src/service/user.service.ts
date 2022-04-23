import UserModel, { User } from "../model/user.model";

export async function createUser(input: Partial<User>){
    return await UserModel.create(input);
}
