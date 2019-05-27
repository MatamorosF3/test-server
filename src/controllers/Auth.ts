import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class Auth {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set

    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }
    console.log("Username:" );
    console.log(password)
    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      console.log("Enterd to faind user");
      user = await userRepository.findOneOrFail({ where: { username } });
      console.log("This is the user: ");
      console.log(user);
    } catch (error) {
      console.log("error");
      res.status(401).send();
    }

    console.log("Password");

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
       console.log("not matched");
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );
    console.log("Token:");
    console.log(token)
    //Send the jwt in the response
    res.send({'token':token, 'role':user.role, 'userId': user.id});
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default Auth;
