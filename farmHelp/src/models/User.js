// const mongoose = require('../database')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// const passportLocalMongoose = require('passport-local-mongoose');
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express();

app.use(cookieParser)

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 2,
        max: 20
    },

    phone:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
        min: 2,
        max: 12
    },

    time:{
        type: Array,
        default: []
    },

    date:{
        type: Array,
        default: []
    },

    address:{
        type: String,
        default: ""
    },

    location:{
        type: String,
        // required: true,
    },

    cname:{
        type: Array,
        default: []
    },

    description:{
        type: Array,
        default: []
    },

    units:{
        type: Array,
        default: []
    },

    weight:{
        type: Array,
        default: []
        // required: true,
    },

    price:{
        type: Array,
        default: []
        // required: true,
    }
})

userSchema.methods.generateAuthToken = async function(req, res){
    try {
        let token = await jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        // console.log(token);
        // res.cookie('token', token)
        // this.tokens = this.tokens.concat({token: token});
        // await this.save();
        // console.log(token);
        return token
    } catch (error) {
        console.log(error);
    }
}


// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;