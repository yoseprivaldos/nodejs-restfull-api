import express from "express";

import { publicRouter } from "../routes/public-route.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { addressRouter, contactRouter, userRouter } from "../routes/api.js";

export const web = express();

web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(contactRouter);
web.use(addressRouter);

web.use(errorMiddleware);
