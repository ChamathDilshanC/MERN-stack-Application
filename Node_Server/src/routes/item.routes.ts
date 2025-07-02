import { Router } from "express";
import {
  addItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "../controller/item.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const itemRouter = Router();
// itemRouter.use(authenticateToken);

itemRouter.post("/", addItem);
itemRouter.get("/", getItems);
itemRouter.get("/:id", getItemById);
itemRouter.put("/:id", updateItem);
itemRouter.delete("/:id", deleteItem);

export default itemRouter;
