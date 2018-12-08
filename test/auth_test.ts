// Sample Test file
import { cleanCollections, login, request} from "./common";
// write Test here
describe("# User Login", () => {
    const endpoint = process.env.API_BASE + "login";

    it("admin should retrieve the token", () => {
        return cleanCollections().then(res => {
            return login("admin").then(res => {
                res.status.should.equal(200);
                res.body.token.should.not.be.empty;
            });
        });
    });

    it("moderator should retrieve the token", () => {
        return cleanCollections().then(res => {
            return login("moderator").then(res => {
                res.status.should.equal(200);
                res.body.token.should.not.be.empty;
            });
        });
    });

    it("user should retrieve the token", () => {
        return cleanCollections().then(res => {
            return login("user").then(res => {
                res.status.should.equal(200);
                res.body.token.should.not.be.empty;
            });
        });
    });

    it("should not login with the right user but wrong password", () => {
        return request.post(endpoint)
            .send({ "username": "admin", "password": "anythingGoesHere" })
            .expect(401);
    });

    it("should return invalid credentials error", () => {
        return request.post(endpoint)
            .send({ "username": "admin", "password": "" })
            .expect(401)
            .then(res => {
                return request.post(endpoint)
                    .send({ "username": "newadmin", "password": "mypass" })
                    .expect(401);
            });
    });

    it("should return token expired message", () => {
        return request.post(process.env.API_BASE + "tasks")
            .set("Authorization", "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjczMzE4NzksInVzZXJuYW1lIjoidGVzdHVzZXIiLCJyb2xlIjoibW9kZXJhdG9yIn0.Ha7HdMPpPWwCNWTqpmg3iTgn671cAPBE_9qTezhX-ws")
            .send({
                name: "Do the dishes"
            })
            .expect(res => res.body.message.should.equal("Your token has expired. Please generate a new one"))
            .expect(401);
    });
});