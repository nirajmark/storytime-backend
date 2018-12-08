class CommonMethods {
    validateAdminRole = (req, res, next) => {
        console.log("user = " + JSON.stringify(req.user));
        if (req.user.role === "admin") {
            next();
        } else {
            console.log("in else block of middle ware");
            res.status(401).json({"message": "Only admin can create users"});
        }
    }
}

export default new CommonMethods();
