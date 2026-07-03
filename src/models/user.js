import { Schema, model } from "mongoose";

const userSchema = new Schema({});

export const UserModel = model("user", userSchema);