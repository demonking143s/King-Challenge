import express from 'express';
import Player from "../models/playerModel.js";

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
    const { game, sortBy } = req.query; //get query from frontend using tanstack query in frontend

    // Check all details are includes
    if(!game || !sortBy){
        return res.status(400).json({ error: 'Game and sortBy parameters are required'});
    }

    // Sort a player details based on above given details
    try {
        const leaderboard = await Player.find().sort({ [`games.${game}.${sortBy}`]: -1 }).limit(10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;