import Player from "../models/playerModel.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req,res) => {
    try {
        const { username } = req.params; //get username from url
        const user = await Player.findOne({playername: username}); //get given user name detail from database

        if(!user){
            return res.status(400).json({error: "User not found"});
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("error from getProfile", error);
        res.status(500).json({message: "Internal server error "});
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.player._id; //get a player id from token
        const {playername, email, currentPassword, newPassword} = req.body; //get details from frontend

        // Search a user id is here or not  
        const user = await Player.findById({_id: userId});
        if(!user){
            return res.status(400).json({error:"user not found"});
        }

        // Check both passwords are given
        if((!currentPassword && newPassword) || (!newPassword && currentPassword)){
            return res.status(400).json({error:"please enter both current password and new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password); //compare given password is right or not
            if(!isMatch){
                return res.status(400).json({error: "Invalid password"});
            }

            // Change a password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            
        }

        // Email validation before update
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Check given email or playername exits or not
        const existingPlayerEmail = await Player.findOne({ email });
        const existingPlayerName = await Player.findOne({ playername });

        if (existingPlayerEmail || existingPlayerName) {
            // Check given email or playername is current user or not
            if ((email!==user.email) || (playername!==user.playername)) {
                return res.status(400).json({ error: "Player already exists" });
            }
        }

        // If both didn't give don't change anything
        user.playername= playername || user.playername;
        user.email = email || user.email;

        await user.save();
        user.password = null;
        res.status(200).json({message: "updated successfully"});

    } catch (error) {
        console.log("error from updateUser", error);
        res.status(500).json({message: "Internal server error"});
        
    }
}