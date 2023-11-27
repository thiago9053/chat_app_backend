import { userRouter } from "@modules/users/router/user";
import { profileRouter } from "@modules/profiles/router/profile";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	return res.json({ message: "Nodemon --legacy-watch" });
});

router.use("/user", userRouter);
router.use("/profile", profileRouter);

export { router };
