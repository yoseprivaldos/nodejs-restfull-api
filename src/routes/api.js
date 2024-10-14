import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import contactController from "../controllers/contact-controller.js";
import addressController from "../controllers/address-controller.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Contact API
const contactRouter = express.Router();
contactRouter.use(authMiddleware);
contactRouter.post("/api/contacts", contactController.create);
contactRouter.get("/api/contacts/:contactId", contactController.get);
contactRouter.put("/api/contacts/:contactId", contactController.update);
contactRouter.delete("/api/contacts/:contactId", contactController.remove);
contactRouter.get("/api/contacts", contactController.search);

// Address API
const addressRouter = express.Router();
addressRouter.use(authMiddleware);
addressRouter.post("/api/contacts/:contactId/addresses", addressController.create);
addressRouter.get("/api/contacts/:contactId/addresses/:addressId", addressController.get);
addressRouter.put("/api/contacts/:contactId/addresses/:addressId", addressController.update);
addressRouter.delete("/api/contacts/:contactId/addresses/:addressId", addressController.remove);
addressRouter.get("/api/contacts/:contactId/addresses", addressController.list);

export { userRouter, contactRouter, addressRouter };
