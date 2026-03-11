const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const validate = require("../middlewares/validate")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
// const redisClient = require("./redis")
const submit = require("../models/submission.model")
const { checkAuth } = require("../../frontend/src/redux/authSlice")


async function user_register(req, res) {
  try {
    validate(req.body);

    req.body.password = await bcrypt.hash(req.body.password, 7);
    req.body.role = "user";

    // Save user first
    const user = await User.create(req.body);

    // Create JWT using saved user ID
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "hhhhhdgd",
      { expiresIn: "1h" }
    );

    // Set cookie 
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if https
      sameSite: "lax",
    });

    const reply = {
      firstname: user.firstname,
      emailid: user.email,
      _id: user._id,
      role:user.role
    };

    res.status(201).json({
      user: reply,
      token: token, // return token
      message: "register successfully"
    });

  } catch (err) {
    res.status(400).send(err.message);
  }
}





// async function user_register(req,res){

//     try {
//         validate(req.body)


//         req.body.password = await bcrypt.hash(req.body.password, 7)
//         req.body.role="user"


//         const token = jwt.sign({ email: req.body.email,password:req.body.password,role:req.body.role }, "hhhhhdgd", { expiresIn: 60 * 60 })
//         res.cookie("token", token)



//        const user= await User.create(req.body)

//           const reply={
//         firstname:user.firstname,
//         emailid:user.email,
//         _id:user._id
//     }

//         res.status(201).json({
//             user:reply,
//             message:"register succesfully"
//         })
//     } catch (err) {
//         res.status(400).send(err.message)
//     }


// }



async function login(req, res) {

  try {
    const { email, password } = req.body

    if (!email) {
      throw new Error("invalid credential")
    }

    if (!password) {
      throw new Error("invalid credential")
    }

    //  if(!role){
    //     throw new Error("invalid credential") 
    // }

    const user = await User.findOne({ email })

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new Error("invalid credential")
    }


    const token = jwt.sign({ email: user.email, password: user.password, role: user.role }, "hhhhhdgd", { expiresIn: 60 * 60 })
    // res.cookie("token", token,)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if https
      sameSite: "lax",
    });


    const reply = {
      firstname: user.firstname,
      emailid: user.email,
      _id: user._id,
      role:user.role
    }

    res.status(200).json({
      user: reply,
      message: "login succesfully"
    })

  } catch (err) {
    res.status(400).send(err.message)
  }

}


async function admin_register(req, res) {

  try {
    validate(req.body)

    req.body.password = await bcrypt.hash(req.body.password, 7)



    const token = jwt.sign({ email: req.body.email, password: req.body.password, role: req.body.role }, "hhhhhdgd", { expiresIn: 60 * 60 })
    res.cookie("token", token)

    await User.create(req.body)

    res.send("admin enter")
  } catch (err) {
    res.status(400).send(err.message)
  }


}


async function logout(req, res) { 

   try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
  // try {

  //   const { token } = req.cookies;
 
  //   const payload = jwt.decode(token)

  //   await redisClient.set(`token:${token}`, "blocked")
  //   await redisClient.expireAt(`token:${token}`, payload.exp)

  //   res.cookie("token", null, { expires: new Date(Date.now()) })
  //    res.clearCookie('token', { 
  //     path:'/',
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax"
  // });
  //   res.send("logout successfull")

  // } catch (err) {
  //   res.send("Error:" + err)

  // }
}

async function deleteuserprofile(req, res) {
  const userId = req.result._id

  if (!userId) {
    req.send("user not found")
  }

  const profile = User.findByIdAndDelete(userId)

  submit.deleteMany({ userId })


}


// async function checkAuthuser(req, res) {
//   const reply = {
//     firstname: req.result.firstname,
//     emailid: req.result.email,
//     _id: req.result._id,
//     role:req.result.role
//   }

//   res.status(200).send({
//     user: reply,
//     message: "valid user"
//   })

// }

async function checkAuthuser(req, res) {
  try {
    const user = req.result;

    const reply = {
      firstname: user.firstname,
      emailid: user.email,
      _id: user._id,
      role: user.role
    };

    return res.status(200).json({
      user: reply,
      message: "valid user"
    });
  } catch (err) {
    return res.status(401).json({
      user: null,
      message: err.message
    });
  }
}



module.exports = { user_register, admin_register, login, logout, deleteuserprofile, checkAuthuser }

