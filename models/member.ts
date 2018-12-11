import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IPack extends mongoose.Document {
    type: string;
    count: number;
}


export interface ICount extends mongoose.Document {
    bf_pack: IPack;
    lunch_pack: IPack;
    dinner_pack: IPack;
    snacks_pack: IPack;
}

export interface IMember extends mongoose.Document {
    name: string;
    username: string;
    password: string;
    active: boolean;
    count: ICount;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPersonalInfo extends mongoose.Document {
    address: string;
    phone1: string;
    phone2: string;
    email: string;
}

const packSchema = new mongoose.Schema({
    type: String,
    count: Number
});

const countSchema = new mongoose.Schema({
    bf_pack: packSchema,
    lunch_pack: packSchema,
    snacks_pack: packSchema,
    dinner_pack: packSchema
});

export const personalInfoSchema = new mongoose.Schema({
    address: String,
    phone1: String,
    phone2: String,
    email: String
});

export const schema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean
    },
    count : countSchema,
    personalInformation: mongoose.Schema.Types.ObjectId,
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

schema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

schema.pre("update", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

schema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};

export const model = mongoose.model<IMember>("Member", schema);
export const personalInfoModel = mongoose.model<IPersonalInfo>("PersonalInfo", schema);

export const memberCleanCollection = () => model.remove({}).exec();
export const personalInfoCleanCollection = () => personalInfoModel.remove({}).exec();

export default model;