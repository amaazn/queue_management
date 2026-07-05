import Queue from "../models/Queue.js";
import Token, { TOKEN_STATUS } from "../models/Token.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const getQueues = asyncHandler(async (req, res) => {
  const queues = await Queue.find().sort({ createdAt: -1 }).lean();

  const data = [];
  for (const q of queues) {
    const waitingCount = await Token.countDocuments({
      queueId: q._id,
      status: TOKEN_STATUS.WAITING,
    });
    data.push({ ...q, waitingCount });
  }

  res.status(200).json({ success: true, count: data.length, queues: data });
});

export const createQueue = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Queue name is required");
  }

  const exists = await Queue.findOne({
    name: new RegExp(`^${name.trim()}$`, "i"),
  });
  if (exists) {
    throw new ApiError(409, "A queue with that name already exists");
  }

  const queue = await Queue.create({
    name: name.trim(),
    createdBy: req.manager._id,
  });

  res.status(201).json({ success: true, queue });
});

export const getQueueById = asyncHandler(async (req, res) => {
  const queue = await Queue.findById(req.params.id).lean();
  if (!queue) {
    throw new ApiError(404, "Queue not found");
  }
  res.status(200).json({ success: true, queue });
});

export const deleteQueue = asyncHandler(async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  if (!queue) {
    throw new ApiError(404, "Queue not found");
  }

  await Token.deleteMany({ queueId: queue._id });
  await queue.deleteOne();

  res.status(200).json({ success: true, message: "Queue deleted" });
});
