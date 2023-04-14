import asyncHandler from "express-async-handler"
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";


////// Create the account 

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the Fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("user already exists");
    }

    const user = await User.create({
        name, email, password, pic,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            status: true,
        });

    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }

})


//////// Login the user
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passStatus = await user.matchPassword(password);
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            isAdmin: user.isAdmin,
            status: true,
            token: generateToken(user._id),
        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
})


/////// Searching the user
export const allUsers = asyncHandler(async (req, res) => {
    if (req.query.search) {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ]
        } : {};
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
        res.send(users);
    } else {
        res.status(200).json({ message: "Please pass params", status: false })
    }
})