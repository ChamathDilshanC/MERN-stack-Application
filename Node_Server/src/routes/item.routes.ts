import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItems,
  getItemById,
  updateItem,
} from "../controller/item.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const itemRouter = Router();

// Apply authentication middleware if needed
// itemRouter.use(authenticateToken);

itemRouter.post("/", createItem);
itemRouter.get("/", getItems);
itemRouter.get("/:_id", getItemById);
itemRouter.put("/:_id", updateItem);
itemRouter.delete("/:_id", deleteItem);

export default itemRouter;
