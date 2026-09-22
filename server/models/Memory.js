import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    imageFilename: {
      type: String,
      required: true
    },

    imageContentType: {
      type: String,
      required: true
    },

    imageSize: {
      type: Number,
      required: true
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

memorySchema.index({
  date: -1
});

const Memory = mongoose.model("Memory", memorySchema);

export default Memory;

//lỗi do chữ M viết hoa ở tên file viết thường