const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const retailSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        
    },

    phone:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
        min: 2,
        max: 12
    },
})

// retailSchema.methods.generateAuthToken = async function(){
//     try {
//         let token = await jwt.sign({_id: this._id}, process.env.SECRET_KEY);
//         // console.log(token);
//         // res.cookie('token', token)
//         // this.tokens = this.tokens.concat({token: token});
//         // await this.save();
//         // console.log(token);
//         return token
//     } catch (error) {
//         console.log(error);
//     }
// }

const Retail = mongoose.model("Retail", retailSchema);
module.exports = Retail;