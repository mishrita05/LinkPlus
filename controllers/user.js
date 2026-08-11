const {v4:uuidv4} = require("uuid");
const User= require("../models/user");
const bcrypt = require("bcrypt");
const {setUser}=require("../service/auth");

async function handleUserSignUp(req, res) {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
        email,
    });

    if (existingUser) {

        return res.redirect(
            `/signup?error=emailExists`
        );

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return res.redirect("/login?success=accountCreated");
}

async function handleUserLogIn(req,res){
     const {email,password}=req.body;
    const user = await User.findOne({
        email,
    });
    if (!user) {
        return res.redirect("/login?error=invalidCredentials");
    }
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.redirect("/login?error=invalidCredentials");
    }
    //  const sessionId= uuidv4();
    //  setUser(sessionId,user);
        const token=  setUser(user);
    //  res.cookie("uid",sessionId)
        res.cookie("uid",token,{    
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        console.log("Login route hit");
     return res.redirect("/");
}

async function handleUserLogout(req, res) {

    res.clearCookie("uid");

    return res.redirect("/login");

}


module.exports={
    handleUserSignUp,
    handleUserLogIn,
    handleUserLogout,
}