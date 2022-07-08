'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        tokenVersion: {
            type: Number,
            required: true,
            default: 0,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// if the password is modified: hash it with bcrypt before storing it
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) {
            return next(err);
        }

        this.password = hash;
        next();
    });
});

// make sure to make all usernames lower case
userSchema.pre('save', function (next) {
    if (!this.isModified('username')) {
        return next();
    }

    const lowerCaseUsername = this.username.toLowerCase();
    this.username = lowerCaseUsername;

    next();
});

// schema method for checking if the password entered by the login matches
userSchema.methods.checkPassword = function (password) {
    const passwordHash = this.password;
    return new Promise((resolve, reject) => {
        // compare the hash stored inside the existing user data with the password entered
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                return reject(err);
            }

            resolve(same);
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
