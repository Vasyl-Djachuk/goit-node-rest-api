import express from "express";

import contactsRouter from "./contacts.js";
import userRoter from "./user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use("/users", userRoter);
router.use("/contacts", auth, contactsRouter);

export default router;
