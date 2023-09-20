import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { router } from "./router";

const origin = {
	origin: "*",
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(origin));
app.use(compression());
app.use(helmet());
app.use(morgan("combined"));

app.use(router);

const port = process.env.PORT || 1211;

app.listen(port, () => {
	console.log(`[App]: Listening on port ${port}`);
});
