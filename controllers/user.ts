import { model as UserModel, IUser } from "../models/user";


class User {
    public initialize = () => {

    }

    public createUser = async (req, res) => {
        // console.log(req.user.role)
        try {
            req.checkBody("username", "Username Should not be empty").notEmpty();
            req.checkBody("password", "Password Should not be empty").notEmpty();
            req.checkBody("role", "Role Should not be empty").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            const userModel = new UserModel({
                    username: req.body.username,
                    password: req.body.username,
                    role: req.body.role
                });
            const user = await userModel.save();
            if (user.username) {
                res.json({"message": "User created successfully"});
            } else {
                throw "user not created";
            }
        } catch (err) {
            res.status(400).json({ "message": "User not created", "errors": err });
        }
    }
}

export default new User();