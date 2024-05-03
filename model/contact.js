import { Schema, model } from "mongoose";
const contacts = new Schema(
  {
    name: {
      type: String,
      unique: [true],
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: [true],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

const Contacts = model("contacts", contacts);
export default Contacts;
