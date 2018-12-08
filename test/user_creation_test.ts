import { cleanCollections, login, request, createUserFromApi} from "./common";

describe("# User Creation Tests", () => {
    const endpoint = process.env.API_BASE + "createUser";
    const testUserToCreate = {"username": "moderator1", "password": "password1", "role": "moderator"};
    const testUserWithoutUsername = {"username": "", "role": "user" };

    it("admin should able to create", () => {
        return cleanCollections().then(res => {
            return login("admin").then(res => {
                return createUserFromApi(res.body.token, testUserToCreate).then(res => {
                    res.status.should.equal(200);
                    res.body.message.should.equal("User created successfully");
                });
            });
        });
    });

    it("moderator should not be able to create user", () => {
        return cleanCollections().then(res => {
            return login("moderator").then(res => {
                return request.post(endpoint)
                .set("Authorization", res.body.token)
                .send(testUserToCreate)
                .expect(401)
                .then (res => {
                    return res.body.message.should.equal("Only admin can create users");
                });
            });
        });
    });

    it("User creation with wrong body", () => {
        return cleanCollections().then(res => {
            return login("admin").then(res => {
                return request.post(endpoint)
                .set("Authorization", res.body.token)
                .send(testUserWithoutUsername)
                .expect(400)
                .then (res => {
                    console.log(res.body.errors);
                    return res.body.message.should.equal("User not created");
                });
            });
        });
    });


});