import express from "express";
import {
  getQueues,
  createQueue,
  getQueueById,
  deleteQueue,
} from "../controllers/queueController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getQueues).post(createQueue);
router.route("/:id").get(getQueueById).delete(deleteQueue);

export default router;
