const express = require('express')
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const User = require('./models/user')
const Retail = require('./models/Retail')
const multer = require('multer')
const path = require('path')
 require('./database')
 const authen = require('./authen')

const app = express();
const PORT = 8000;
 
app.set("view engine", "ejs");
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
const staticpath = path.join(__dirname, "../public")
const img_path = path.join(__dirname, "../public/images")
app.use(express.static(img_path))
app.use(express.static(staticpath))


app.get("/home",  (req, res)=>{
    // res.send("home", {name: req.cookies.name})
    // res.cookie('name', req.cookies.name).render("home")
    res.render('home', { name: req.cookies.name })
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", async(req, res)=>{
    const {name, phone, password} = req.body;

    if (!name || !phone || !password) {
        return res.status(422).json({ fields: "*Fill all the fields" })
    }

    if (name.length < 2) {
        return res.json({ fields: "*Username is too short" });
    }

    if (password.length < 2) {
        return res.json({ fields: "*Password is too short" });
    }

    try {
        const userExist = await User.findOne({ phone: phone })   //database: user entered

        if (userExist) {
            return res.render('register', { message: "*Phone number already exists" })
        }

        const user = new User({ name: name, phone: phone, password: password });
 
        const userRegister = await user.save()
        

        if (userRegister) {
            res.status(201).redirect("/login")
        }
        else {
            res.status(500).render('register', { error: "Failed to register" })

        }
    } catch (error) {
        console.log(error);
    }


})


app.get("/retail/register", (req, res)=>{
    res.render('regr')
})

app.post("/retail/register", async(req, res)=>{
    const {name, phone, email, password} = req.body;


    if (!name || !phone || !password ||!email) {
        return res.status(422).json({ fields: "*Fill all the fields" })
    }

    if (name.length < 2) {
        return res.json({ fields: "*Username is too short" });
    }

    if (password.length < 2) {
        return res.json({ fields: "*Password is too short" });
    }

    try {
        const retailerExist = await Retail.findOne({ phone: phone }) 

        if (retailerExist) {
            return res.json({ message: "*Phone number already exists" })
        }

        const retail = new Retail({ name: name, phone: phone, email: email,  password: password });

        const retailerRegister = await retail.save()
        res.cookie('name', name)

        if (retailerRegister) {
            res.status(201).render('logr')
        }
        else {
            res.status(500).render('regr', { error: "Failed to register" })

        }
    } catch (error) {
        console.log(error);
    }
})



app.get('/login', (req, res) => {
    res.render('login')
})

app.post("/login",async (req, res)=>{
   
    try {
        
        let token;
        const { name, phone, password } = req.body; 
        // console.log(password); 
        if (!name || !phone || !password) {
            return res.status(400).json( { fields: "*Fill all the fields" })
        }

        const userLogin = await User.findOne({ phone: phone });
        // console.log(userLogin);
        token = await userLogin.generateAuthToken();
        if(!userLogin){
            res.render('login', {wrong: "*Invalid credentials"})
           
        }

        else{
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),     
                httpOnly: true

            })
            // console.log("logged");
        res.cookie('name', name)
        res.cookie('phone', phone)

            res.redirect("/")
        }

        
    } catch (error) {
        console.log(error);
    }
})

app.get('/retail/login', (req, res) => {
    res.render('logr')
})

app.post("/retail/login", async(req, res)=>{
    try {
        let token;
        const { name, phone,  password } = req.body; 
        // console.log(name); 
        if (!name || !phone || !password ) {
            return res.status(400).json( { fields: "*Fill all the fields" })
        }

        const userLogin = await Retail.findOne({ phone: phone });
        // console.log(userLogin);
        // token = await userLogin.generateAuthToken();
        if(userLogin.password == password && userLogin.name ==name && userLogin.phone == phone ){
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),     
                httpOnly: true

            })
            // console.log("logged");
            res.cookie('name', name)
            res.cookie('phone', phone)

            

            res.redirect("/homeRetail")
        }

        else{
            res.send("logr", {msg: "*Invalid credentials"})
        }

        
    } catch (error) {
        console.log(error);
    }
})
 
app.get("/front", (req, res)=>{ 
    res.render("front")
})

// app.get("/home", (req, res)=>{

//     res.render("home")
// })

// app.post("/home", (req, res)=>{
//     const apple = req.body.apple;
//     console.log(apple);
//     res.render() 

// })


app.get("/reg", (req, res)=>{
    res.render('register')
})

// app.get("/profile", authen, (req, res)=>{
//     res.render("profile");
// })

app.get("/profile", authen, async(req, res)=>{
    const phone = req.cookies.phone;

    try {
        const p = await User.findOne({ phone: phone });
        // console.log(p.cname);
        // console.log(p);
        if(p){
            return res.render('profile', {name: p.name, phone: p.phone, address: p.address, cname: p.cname, description: p.description, units: p.units, weight: p.weight, price: p.price})
        }
    } catch (error) {
        console.log(error);
    }

})



app.get("/editProfile", async(req, res)=>{
    const phone = req.cookies.phone;

    try {
        const p = await User.findOne({ phone: phone });
      
        if(p){
            return res.render('editProfile', {name: p.name, phone: p.phone})
        }
    } catch (error) {
        console.log(error);
    }
})


app.post("/editProfile", async(req, res)=>{
    const address = req.body.address;
    const phone = req.cookies.phone;

    try {
        const p = await User.findOne({ phone: phone });
        if(p){
            User.updateOne({phone: phone}, { address: address });
            
            p.address = address;
            console.log(address);
            // console.log(p.address);
            const userRegister = await p.save()
            // console.log(p);

            return res.redirect("/profile")
        }

        else{
            return res.render("profile")
        }
    } catch (error) {
        console.log(error);
    }

})

//image
imgName = "";
storage = multer.diskStorage({
    destination: function (req, file, c) {
        c(null, '../public/images')
    },
    filename: function (req, file, c) {
        c(null, file.originalname)
        imgName = file.originalname;    
    }
})
upload = multer({ storage: storage })

app.get("/fform", authen, (req, res)=>{
    res.render("fform")
})

app.post("/fform", upload.single('profile-file'), async(req, res)=>{
    const {name, description, units, weight, price, time, date} = req.body;
    const phone = req.cookies.phone;
    // console.log(date);
    // console.log(time);
    try {
        const p = await User.findOne({ phone: phone });
        if(p){
            p.cname.push(name)
            p.description.push(description)
            p.units.push(units)
            p.weight.push(weight)
            p.price.push(price)
            p.date.push(date)
            p.time.push(time)
            // const user = new User({ name: name, phone: phone, password: password });
 
        
           
            const userRegister = await p.save()
            // console.log(p);
            var responses = '<a href="/">Home</a><br>'
            responses += "Files uploaded successfully.<br>"
            responses += `<img style="width: 500px;" src="${imgName}" /> <br>`

            return res.redirect("/")
        }

        else{
            return res.render("fform", {msg: "*Error"})
        }
    } catch (error) {
        console.log(error);
    }
})

app.get("/", (req, res)=>{
    res.render("open", {name: req.cookies.name})
})


app.get("/dummy", async(req, res)=>{
    User.find({}, function(err, users) {
        var userMap = {};
    
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
    
        // res.send(userMap);  
        res.render("dummy", {msg: userMap})
      });
    // res.send(userMap)

})



app.get("/homeRetail", async(req, res)=>{
    // User.find({}, function(err, users) {
    //     var userMap = {};
    
    //     users.forEach(function(user) {
    //       userMap[user._id] = user;
    //     }); 
    //     console.log(userMap);
    //     res.render("front", {msg: userMap}); 
    // });

    var emp = User.find({  });
    emp.exec(function (err, data) {
        if (err) res.send(err)
        // console.log(data[9].description[0]);
        // res.send(data)
        

        res.render('front', {  records: data })

    })
   
});

app.get("/details", (req, res)=>{
    res.render("details")
})

app.post("/details", async(req, res)=>{
    const n = req.body.n;
    // console.log(n);
    var p =  await User.findOne({ phone: n });
    // console.log(p);

    // p.exec(function(err, data){
    //     if (err) res.send(err)
        
    //     res.render("details", {records: data[0].cname, records2: data[0].description, records3: data[0].units, records3: data[0].weight,  records4: data[0].price})
    // })
    res.cookie('date', p.date)
    res.cookie('time', p.time)

   
    var times;
    var dest=new Date("2023-01-22 20:51").getTime();
    var x = setInterval(() => {
    var now = new Date().getTime();
    var diff=dest-now;
    var days=Math.floor(diff/(1000*60*60*24));
 
    var hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  
    var minutes = Math.floor((diff%(1000*60*60))/(1000*60));

    var seconds = Math.floor((diff%(1000*60))/(1000));
    
    times = `${hours}: ${minutes}: ${seconds}`
    // console.log(times);
    
            
}, 1000);

    console.log(times);
    res.render("details", {records: p.cname, records2: p.description, records3: p.units, records4: p.weight, records5: p.price, records6: p.time, records7: p.date})
})

app.get("/homr", (req, res)=>{
    res.render("homr")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
