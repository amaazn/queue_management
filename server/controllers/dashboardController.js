import Token, { TOKEN_STATUS } from "../models/Token.js";
import Queue from "../models/Queue.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildDateAxis = (days = 7) => {
  const axis = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    axis.push({ key, label });
  }
  return axis;
};

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

export const getDashboard = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const axis = buildDateAxis(7);
  const windowStart = new Date(`${axis[0].key}T00:00:00.000Z`);

  const totalQueues = await Queue.countDocuments();
  const waitingTokens = await Token.countDocuments({
    status: TOKEN_STATUS.WAITING,
  });
  const servedToday = await Token.countDocuments({
    status: TOKEN_STATUS.SERVED,
    servedAt: { $gte: startOfToday },
  });
  const cancelledToday = await Token.countDocuments({
    status: TOKEN_STATUS.CANCELLED,
    cancelledAt: { $gte: startOfToday },
  });

  const allServed = await Token.find({
    status: TOKEN_STATUS.SERVED,
    servedAt: { $ne: null },
  });
  let avgWaitSeconds = 0;
  if (allServed.length > 0) {
    const totalMs = allServed.reduce(
      (sum, t) => sum + (t.servedAt - t.createdAt),
      0
    );
    avgWaitSeconds = Math.round(totalMs / allServed.length / 1000);
  }

  const queues = await Queue.find();
  let longestQueue = null;
  for (const q of queues) {
    const count = await Token.countDocuments({
      queueId: q._id,
      status: TOKEN_STATUS.WAITING,
    });
    if (!longestQueue || count > longestQueue.count) {
      longestQueue = { name: q.name, count };
    }
  }

  if (longestQueue && longestQueue.count === 0) longestQueue = null;

  const createdInWindow = await Token.find({
    createdAt: { $gte: windowStart },
  });
  const servedInWindow = await Token.find({
    status: TOKEN_STATUS.SERVED,
    servedAt: { $gte: windowStart },
  });
  const cancelledInWindow = await Token.find({
    status: TOKEN_STATUS.CANCELLED,
    cancelledAt: { $gte: windowStart },
  });

  const buckets = {};
  axis.forEach(({ key }) => {
    buckets[key] = {
      added: 0,
      served: 0,
      cancelled: 0,
      waitMsTotal: 0,
      servedCount: 0,
    };
  });

  createdInWindow.forEach((t) => {
    const b = buckets[dayKey(t.createdAt)];
    if (b) b.added += 1;
  });
  servedInWindow.forEach((t) => {
    const b = buckets[dayKey(t.servedAt)];
    if (b) {
      b.served += 1;
      b.waitMsTotal += t.servedAt - t.createdAt;
      b.servedCount += 1;
    }
  });
  cancelledInWindow.forEach((t) => {
    const b = buckets[dayKey(t.cancelledAt)];
    if (b) b.cancelled += 1;
  });

  const trend = axis.map(({ key, label }) => {
    const b = buckets[key];
    const avgWaitMin =
      b.servedCount > 0
        ? Math.round((b.waitMsTotal / b.servedCount / 60000) * 10) / 10
        : 0;
    return {
      date: label,
      added: b.added,
      served: b.served,
      cancelled: b.cancelled,
      avgWaitMin,
    };
  });

  res.status(200).json({
    success: true,
    stats: {
      totalQueues,
      waitingTokens,
      servedToday,
      cancelledToday,
      averageWaitTime: {
        seconds: avgWaitSeconds,
        label: formatDuration(avgWaitSeconds),
      },
      longestQueue,
    },
    trend,
  });
});
