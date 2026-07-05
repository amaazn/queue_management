import mongoose from "mongoose";

export const TOKEN_STATUS = {
  WAITING: "WAITING",
  SERVED: "SERVED",
  CANCELLED: "CANCELLED",
};

const tokenSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
      index: true,
    },
    tokenNumber: {
      type: Number,
      required: true,
    },
    personName: {
      type: String,
      required: [true, "Person name is required"],
      trim: true,
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TOKEN_STATUS),
      default: TOKEN_STATUS.WAITING,
      index: true,
    },

    servedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
