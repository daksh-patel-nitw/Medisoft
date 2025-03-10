import bcrypt from 'bcryptjs';
import loginModel from '../models/login.js';

export const SignUp = async (mid, name, role, password, security_phrase,dep) => {
    try {

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(String(password), saltRounds);
        const hashed_security_phrase = await bcrypt.hash(String(security_phrase), saltRounds);

        // Create a new login record
        const newLogin = new loginModel({
            mid,
            name,
            password: hashedPassword,
            panel: role,
            ...(dep && { dep }),
            security_phrase: hashed_security_phrase
        });

        // Save to the database
        await newLogin.save();
        return newLogin;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteLogin = async (mid) => {
    try {
  
        const deletedUser = await loginModel.findOneAndDelete({ mid: mid });

        if (!deletedUser) {
            throw new Error('User not found');
        }
        return "success";
    } catch (error) {
        console.error(error);
        throw error;
    }
};