import {Request, Response} from "express";
import {getManager} from "typeorm";
import {User} from "../entity/User";
import { validate } from "class-validator";
// import { Category } from "../entity/Category"; // Still pending

export async function post(request: Request, response: Response) {

  let { username, password, role } = request.body;
  let user = new User();
  user.username = username;
  user.password = password;
  user.role = role;

  //Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    response.status(400).send(errors);
    return;
  }

  //Hash the password, to securely store on DB
  user.hashPassword();


    const userRepository = getManager().getRepository(User);
    //const categoryRepository = getManager().getRepository(Category);
    //const categories = await categoryRepository.findByIds(request.body.categories)
    //request.body.categories = categories;

    const newUser = userRepository.create(user);
    //Hash the password, to securely store on DB


    await userRepository.save(newUser);

    response.send(newUser);
}

export async function getAll(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    response.send(users);
}

export async function getOne(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(request.params.id);

    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }
    response.send(user);
}

export async function put(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    // const categoryRepository = getManager().getRepository(Category);

    const user = await userRepository.findOne(request.params.id);
    // const categories = await categoryRepository.findByIds(request.body.categories)
    // request.body.categories = categories;

    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }

    user.username = request.body.username || user.username;
    user.role = request.body.role || user.role;
    // post.categories = request.body.categories || post.categories;

    await userRepository.save(user);

    response.send(user);
}

export async function remove(request: Request, response: Response) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(request.params.id);
    console.log("Ready to delete");
    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }

    await userRepository.remove(user);

    response.send(user);
}
