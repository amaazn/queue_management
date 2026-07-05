import Token, { TOKEN_STATUS } from "../models/Token.js";
import Queue from "../models/Queue.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const resequenceQueue = async (queueId) => {
  const waiting = await Token.find({
    queueId,
    status: TOKEN_STATUS.WAITING,
  }).sort({ position: 1 });

  for (let i = 0; i < waiting.length; i++) {
    const desiredPosition = i + 1;
    if (waiting[i].position !== desiredPosition) {
      waiting[i].position = desiredPosition;
      await waiting[i].save();
    }
  }
};

export const getTokens = asyncHandler(async (req, res) => {
  const { queueId } = req.params;

  const queue = await Queue.findById(queueId).lean();
  if (!queue) {
    throw new ApiError(404, "Queue not found");
  }

  const waiting = await Token.find({
    queueId,
    status: TOKEN_STATUS.WAITING,
  })
    .sort({ position: 1 })
    .lean();

  const history = await Token.find({
    queueId,
    status: { $ne: TOKEN_STATUS.WAITING },
  })
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    queue,
    waiting,
    history,
  });
});

export const addToken = asyncHandler(async (req, res) => {
  const { queueId, personName } = req.body;

  if (!queueId) throw new ApiError(400, "queueId is required");
  if (!personName || !personName.trim()) {
    throw new ApiError(400, "Person name is required");
  }

  const queue = await Queue.findById(queueId);
  if (!queue) throw new ApiError(404, "Queue not found");

  const lastToken = await Token.findOne({ queueId })
    .sort({ tokenNumber: -1 })
    .select("tokenNumber");
  const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

  const waitingCount = await Token.countDocuments({
    queueId,
    status: TOKEN_STATUS.WAITING,
  });

  const token = await Token.create({
    queueId,
    personName: personName.trim(),
    tokenNumber,
    position: waitingCount + 1,
    status: TOKEN_STATUS.WAITING,
  });

  res.status(201).json({ success: true, token });
});

export const moveTokenUp = asyncHandler(async (req, res) => {
  const token = await Token.findById(req.params.id);
  if (!token) throw new ApiError(404, "Token not found");
  if (token.status !== TOKEN_STATUS.WAITING) {
    throw new ApiError(400, "Only waiting tokens can be moved");
  }

  if (token.position <= 1) {
    throw new ApiError(400, "This token is already at the top of the queue");
  }

  const tokenAbove = await Token.findOne({
    queueId: token.queueId,
    status: TOKEN_STATUS.WAITING,
    position: token.position - 1,
  });
  if (!tokenAbove) throw new ApiError(400, "No token ahead to swap with");

  [token.position, tokenAbove.position] = [tokenAbove.position, token.position];
  await token.save();
  await tokenAbove.save();

  res.status(200).json({ success: true, message: "Token moved up" });
});

export const moveTokenDown = asyncHandler(async (req, res) => {
  const token = await Token.findById(req.params.id);
  if (!token) throw new ApiError(404, "Token not found");
  if (token.status !== TOKEN_STATUS.WAITING) {
    throw new ApiError(400, "Only waiting tokens can be moved");
  }

  const waitingCount = await Token.countDocuments({
    queueId: token.queueId,
    status: TOKEN_STATUS.WAITING,
  });

  if (token.position >= waitingCount) {
    throw new ApiError(400, "This token is already at the bottom of the queue");
  }

  const tokenBelow = await Token.findOne({
    queueId: token.queueId,
    status: TOKEN_STATUS.WAITING,
    position: token.position + 1,
  });
  if (!tokenBelow) throw new ApiError(400, "No token behind to swap with");

  [token.position, tokenBelow.position] = [tokenBelow.position, token.position];
  await token.save();
  await tokenBelow.save();

  res.status(200).json({ success: true, message: "Token moved down" });
});

export const serveNextToken = asyncHandler(async (req, res) => {
  const { queueId } = req.params;

  const queue = await Queue.findById(queueId);
  if (!queue) throw new ApiError(404, "Queue not found");

  const nextToken = await Token.findOne({
    queueId,
    status: TOKEN_STATUS.WAITING,
  }).sort({ position: 1 });

  if (!nextToken) {
    throw new ApiError(400, "Queue is empty — there is nothing to serve");
  }

  nextToken.status = TOKEN_STATUS.SERVED;
  nextToken.servedAt = new Date();
  nextToken.position = 0;
  await nextToken.save();

  await resequenceQueue(queueId);

  res.status(200).json({ success: true, token: nextToken });
});

export const cancelToken = asyncHandler(async (req, res) => {
  const token = await Token.findById(req.params.id);
  if (!token) throw new ApiError(404, "Token not found");

  if (token.status === TOKEN_STATUS.SERVED) {
    throw new ApiError(400, "Cannot cancel a token that has already been served");
  }
  if (token.status === TOKEN_STATUS.CANCELLED) {
    throw new ApiError(400, "This token is already cancelled");
  }

  token.status = TOKEN_STATUS.CANCELLED;
  token.cancelledAt = new Date();
  token.position = 0;
  await token.save();

  await resequenceQueue(token.queueId);

  res.status(200).json({ success: true, token });
});
