const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name."],
        minlength: [6, "Minimum length is 6 characters."],
        max: 255
    },
    email: {
        type: String,
        required: [true, "Please enter an email."],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email."],
        minlength: [6, "Minimum length is 6 characters."],
        max: 255
    },
    password: {
        type: String,
        required: [true, "Please enter a password."],
        minlength: [6, "Minimum length is 6 characters."],
        max: 1024
    },
    
});

//MONGOOSE HOOK, HASH PASSWORD (FUNCTION FIRED BEFORE SAVING TO DB)
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//STATIC METHOD TO LOGIN USER
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user
        }
        throw Error("Incorrect password.")
    }
    throw Error("Incorrect email.")
}


const User = mongoose.model("User", userSchema);
module.exports = User;