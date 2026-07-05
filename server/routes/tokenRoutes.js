import express from "express";
import {
  getTokens,
  addToken,
  moveTokenUp,
  moveTokenDown,
  serveNextToken,
  cancelToken,
} from "../controllers/tokenController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addToken);

router.put("/serve/:queueId", serveNextToken);

router.put("/:id/up", moveTokenUp);
router.put("/:id/down", moveTokenDown);
router.put("/:id/cancel", cancelToken);

router.get("/:queueId", getTokens);

export default router;
