import jwt from 'jsonwebtoken';

const generateToken = (playerId, res) => {
    const token = jwt.sign({ playerId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    }) //make a token with the playerId and the secret key

    res.cookie('sign',  token, {
        maxAge: 15*24*60*1000, //dd*hh*mm*ms
        httpOnly: true, //xss attacks
        sameSite: "strict", //csrf attacks
        secure : process.env.NODE_ENV !== 'development' //allow only in developement
    })
}

export default generateToken;