import mongoose from "mongoose";

// Make a player schema to make structure for mongo db database collection
const playerSchema = mongoose.Schema({
    playername:{
        type : String,
        required : true,
        unique : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true,
        minLength : 8
    },
    games:{
        chess:{
            win:{
                type : Number,
                default : 0
            },
            totalMatch:{
                type : Number,
                default : 0
            }
        }, //add more games here
    }
}, {timestamps : true}); //create a model

// Make a collection in mongo db storage
const users = mongoose.model('users', playerSchema);

export default users;