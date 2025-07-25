import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    ownerName: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

export const ArticlesCollection = model('articles', contactSchema);
