import User from "../controllers/user";
import CommonMethods from "../controllers/common";

export = (app) => {
    /**
    * @api {post} /api/v1/createUser Create a user
    * @apiVersion 1.0.0
    * @apiName Create User
    * @apiGroup User
    * @apiPermission public
    * @apiDescription User can only be created using admin user.
    *
    * @apiParam (Request body) {String} username The username
    * @apiParam (Request body) {String} password The password
    * @apiParam (Request body) {String} role The role (admin/moderator/user)
    *
    * @apiExample {js} Example usage:
    * const data = {
    *   "username": "test@email.com",
    *   "password": "yourpassword",
    *   "role":"admin"
    * };
    *
    * $http.post(url, data)
    *   .success((res) => doSomethingHere())
    *   .error((err) => doSomethingHere());
    *
    * @apiSuccess {String} message User created successfully
    *
    * @apiSuccessExample {json} Success response:
     *     HTTPS 200 OK
     *     {
     *      "message": "User created successfully"
     *    }
    */
    app.post(process.env.API_BASE + "createUser", CommonMethods.validateAdminRole , User.createUser);
};