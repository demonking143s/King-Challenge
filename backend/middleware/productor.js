import jwt from 'jsonwebtoken';
import Player from '../models/playerModel.js';

const productor = async (req, res, next) => {
    try {
        const token = req.cookies.sign; //get token from cookies
        if(!token){
            return res.status(400).json({error: "Unauthorizes: No token"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token
        if(!decoded){
            return res.status(400).json({error: "Unautozied: Invalid Token"});
        }

        const player = await Player.findOne({_id: decoded.playerId}).select("-password"); //find player by token
        if(!player){
            return res.status(400).json({error: "Player not found"});
        }

        req.player = player; //add player to request
        next(); //move to next function
    } catch (error) {
        console.log("error from productor", error);
        res.status(500).json({error: "Internal server error"});
        
    }
}

export default productor;