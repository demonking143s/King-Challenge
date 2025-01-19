import Player from "../models/playerModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Controller for authentication
export const signup = async (req, res) => {
    try {
        const { playername, email, password } = req.body; //get data from frontend

        // Check if playername, email, and password are provided
        if (!playername || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check the email entered is valid or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Check if the player already exists
        const existingPlayerEmail = await Player.findOne({ email });
        const existingPlayerName = await Player.findOne({ playername });
        if (existingPlayerEmail || existingPlayerName) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new player
        const newPlayer = new Player({
            playername,
            email,
            password: hashedPassword
        });

        if(newPlayer){
            generateToken(newPlayer._id, res); // Generate token
            // Save the player to the database
            await newPlayer.save();
            res.status(201).json({ message: "Player registered successfully", _id: newPlayer.id,  playername: newPlayer.playername, email: newPlayer.email,  password: newPlayer.password });
        }
    } catch (error) {
        console.log("error from signup",error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check email exist or not and password is correct or not
        const player = await Player.findOne({email});
        const isCorrectPassword = await bcrypt.compare(password, player.password || "");

        if(!player || !isCorrectPassword){
            return res.status(400).json({error: "Invalid email or password"});
        }

        generateToken(player._id, res); // generate token

        res.status(200).json({message: "Player logged"});
    } catch (error) {
        console.log( "error from login", error);
        res.status(500).json({ error: "Internal server error " });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie('sign', '', { maxAge:0}); // delete cookie
        res.status(200).json({ message:"player logout"});
    } catch (error) {
        console.log("error from logout",error);
        res.status(500).json({ error:"Internal server error" });
        
    }
};

export const getMe = async (req, res) => {
    try {
        const player = await Player.findOne({_id: req.player._id}).select("-password"); // get player data except password
        if(!player){
            return res.status(400).json({error: "player not found"});
        }
        res.status(200).json(player);
    } catch (error) {
        console.log("error from getMe",error);
        res.status(500).json({ error:"Interenal server error" });
        
    }
}