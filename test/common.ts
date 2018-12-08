// We will write common test method inside this file

process.env.NODE_ENV = "test";

import "mocha";
import { IUser, model as User, userCleanCollection } from "../models/user";

const express = require("../config/express")();

export const request = require("supertest")(express);

export const chai = require("chai");
export const should = chai.should();

export const adminTestUser = { "username": "admin", "password": "admin", "role": "admin" };
export const moderatorTestUser = { "username": "moderator", "password": "moderator", "role": "moderator" };
export const userTestUser = {"username": "user", "password": "user", "role": "user" };

const createUser = async (): Promise<void> => {
    const AdminUserModel = new User(adminTestUser);
    await AdminUserModel.save();
    const ModeratorUserModel = new User(moderatorTestUser);
    await ModeratorUserModel.save();
    const UserModel = new User(userTestUser);
    await UserModel.save();
};

const getUser = async (role): Promise<IUser> => {
    let users = await User.find({});
    if (users.length === 0) {
        await createUser();
        return getUser(role);
    } else {
        let roleArray = users.filter((user) => {
            return user.role === role;
        });
        return roleArray[0];
    }
};

export const login = async (role): Promise<any> => {
    let user = await getUser(role);
    let testUser = userTestUser;
    if (role === "admin") {
        testUser = adminTestUser;
    } else if (role === "moderator") {
        testUser = moderatorTestUser;
    }

    return request.post(process.env.API_BASE + "login")
        .send({ "username": user.username, "password": testUser.password })
        .expect(200);
};

export const createUserFromApi = async (token: string, user: object): Promise<any> => {
    return request.post(process.env.API_BASE + "createUser")
        .set("Authorization", token)
        .send(user)
        .expect(200);
};

export const cleanCollections = (): Promise<any> => {
    const cleanUp = [
        userCleanCollection()
        // Add more
    ];
    return Promise.all(cleanUp);
};