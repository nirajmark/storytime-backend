import { model as MemberModel, personalInfoModel as PersonalInfoModel, IMember, IPersonalInfo} from "../models/member";

class Member {
    public createMember = async(req, res) => {
        try {
            req.checkBody("username", "Username Should not be empty").notEmpty();
            req.checkBody("password", "Password Should not be empty").notEmpty();
            req.checkBody("address", "Address Should not be empty").notEmpty();
            req.checkBody("phone1", "phone1 Should not be empty").notEmpty();
            req.checkBody("email", "email Should not be empty").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            const personalInfoModel = new PersonalInfoModel({
                address: req.body.address,
                phone1: req.body.phone1,
                phone2: req.body.phone2 ? req.body.phone2 : "NA",
                email: req.body.email
            });
            const savedPersonalInfo = await personalInfoModel.save();
            if (savedPersonalInfo._id) {
                const memberModel = new MemberModel({
                    name : req.body.name,
                    username: req.body.username,
                    password: req.body.password,
                    pack: req.body.pack,
                    personalInformation: savedPersonalInfo._id
                });
                const createdMember = await memberModel.save();
                if (createdMember._id) {
                   res.json({
                       "message": "member created successfully",
                       createdMember,
                       savedPersonalInfo
                   });
                } else {
                    throw "member not saved";
                }
            } else {
                throw "personal info not saved";
            }
        } catch (err) {
            res.status(400).json({ "message": "Member not created", "errors": err });
        }
    }
}

export default new Member();