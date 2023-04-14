import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true },
    pic: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", },

}, { timestamps: true })


/////////Here we are match the password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//////before saving the data password chnnge in hash , This is working as a middlewear
userSchema.pre('save', async function (next) {
    
    if (!this.isModified) { next() }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
})

////// Update the user Password
////// function to update the password of a user
userSchema.methods.updatePassword = async function (newPassword) {
    const salt = await bcrypt.genSalt(10);
    this.password = newPassword;
    const saveOrNot = await this.save();
    return saveOrNot;
}



const User = mongoose.model("User", userSchema);

export default User;