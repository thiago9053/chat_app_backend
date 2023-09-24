import { userRouter } from "@modules/users/router/user";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	return res.json({ message: "Nodemon --legacy-watch" });
});

router.use("/user", userRouter);

export { router };
