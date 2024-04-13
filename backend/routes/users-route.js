// const express = require('express')
// const { check, validationResult} = require('express-validator')
// const {v4 : uuidv4} = require('uuid') //v4 is the version

// const route=express.Router()

// const user=[
//     {
//       name:"Striver",
//       id:"u1",
//       email:"xyz@gmail.com",
//       password:"Striver"
//     },
//     {
//       name:"Aish Rai",
//       id:"u2",
//       email:"email.com",
//       password:"Hello"
//     },
//     {
//       name:"Mukesh Ambani",
//       id:"u3",
//       email:"J@gmail.com",
//       password:"XYZ"
//     }
//   ]
// route.get('/',(req,res,next)=>{
//     res.status(200).json({users : user})
// })

// route.post('/signup',
// [
//     check('name').not().isEmpty(),
//     check('email').isEmail().normalizeEmail(),
//     check('password').isStrongPassword({
//         minLength: 8 ,
//         minLowercase: 1,
//         minUppercase:1,
//         minNumbers:1,
//         minSymbols:1
//       })
// ],(req,res,next)=>{
//     // extra lines of codee when using external validator
//     const error = validationResult(req)
//     if(!error.isEmpty())
//     {
//         console.log(error)
//         const err=new Error('Please Check youur data')
//         err.code=422
//         return next(err)
//     }
//     //
//     const {name , email, password}=req.body
//     const findUser = user.find(p => p.email===email)
//     if(findUser)
//     {
//         const err=new Error('User already exists!')
//         err.code=422
//         return next(err)
//     }
//     const newuser = {
//         name,
//         email,
//         password,
//         id:uuidv4()
//     }
//     user.push(newuser)
//     res.status(200).json({message:"User Signup successfull", users: user})
// })

// route.post('/login',(req,res,next)=>{
//     const {email, password}=req.body
//     const findUser = user.find(p => p.email===email)
//     if(!findUser)
//     {
//         const err = new Error("User not Found!")
//         err.code=404
//         next(err)
//     }
//     else{
//         if(findUser.password!=password)
//         {
//             const err = new Error("Incorrect password!")
//             err.code=404
//             return next(err)
//         }
//         res.status(200).json({message : "Logged In!"})
//     }
// })

// module.exports=route

// mongoose logic
const express = require('express')
const User = require('../models/user')
const { check, validationResult} = require('express-validator')

const route=express.Router()

route.get('/',async(req,res,next)=>{
    let users;
    try{
        users = await User.find({},'-password') //this will not display the password
    }
    catch(error){
        const err = new Error('Couldnot fetch users')
        err.code=500
        return next(err)
    }
    res.status(200).json({users : users.map((u)=> u.toObject({ getters : true }) )})
})

route.post('/signup',
[
    check('name').not().isEmpty(),
    check('email').isEmail().normalizeEmail(),
    check('password').isStrongPassword({
        minLength: 8 ,
        minLowercase: 1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
      })
],async(req,res,next)=>{
    // extra lines of codee when using external validator
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        console.log(error)
        const err=new Error('Please Check youur data')
        err.code=422
        return next(err)
    }
    //
    const {name , email, password}=req.body
    let existingUser;
    try{
        existingUser = await User.findOne({ email : email })
        console.log(existingUser)
    }
    catch(error)
    {
        const err=new Error('Signing Up failed! Try again later!')
        err.code=500
        return next(err)
    }
    if(existingUser)
    {
        const err=new Error('Email already exists! Please login.')
        err.code=422
        return next(err)
    }
    const newuser = new User({
        name,
        email,
        password,
        image:"https://static.toiimg.com/photo/71579199/empire-state-building.jpg?width=748&resize=4",
        places:[]
    })
    try{
        await newuser.save(newuser)
    }
    catch(error)
    {
        console.log(error)
        const err=new Error('Signing Up failed! Try again later!')
        err.code=500
        return next(err)
    }
    res.status(200).json({message:"User Signup successfull",
    user: newuser.toObject( { getters:true } ) })
})

route.post('/login',async(req,res,next)=>{
    const {email, password}=req.body
    let existingUser;
    try{
        existingUser = await User.findOne({ email : email })
        console.log(existingUser)
    }
    catch(error)
    {
        const err=new Error('Logging In failed! Try again later!')
        err.code=500
        return next(err)
    }
    if(!existingUser)
    {
        const err = new Error("User not Found!")
        err.code=404
        next(err)
    }
    else{
        if(existingUser.password!=password)
        {
            const err = new Error("Incorrect password!")
            err.code=404
            return next(err)
        }
        res.status(200).json({message : "Logged In!", 
        user: existingUser.toObject( { getters:true } )})
    }
})

module.exports=route