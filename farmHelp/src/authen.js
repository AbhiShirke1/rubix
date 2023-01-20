const jwtoken = require('jsonwebtoken')
const User = require('./models/user')

const authen = async(req, res, next) =>{
    try {
        // let token = await jwt.sign({_id: this._id}, process.env.SECRET_KEY);

        const tokenz = req.cookies.jwtoken;
        const verifyUser = jwtoken.verify(tokenz, process.env.SECRET_KEY);
        // console.log(verifyUser);
        const users = await User.findOne({_id:verifyUser._id})
        // console.log(verifyUser);
        // console.log(users);
        
        next();
    } catch (error) {
        res.status(401).redirect('/login')
    }
}

module.exports = authen;