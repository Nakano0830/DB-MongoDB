// 実行方法
// npm run dev src/mongoose/sample/code-01.ts

import "dotenv/config";
import mongoose, { Schema, Model } from "mongoose";

type User = {
  name: string;
  age: number;
};

// Schema 定義
const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    collection: "p_users",
    timestamps: false,
  },
);

// Model（既存定義があれば再利用）
const UserModel: Model<User> =
  mongoose.models.User ?? mongoose.model<User>("User", userSchema);

const main = async () => {
  const uri = process.env.MONGODB_URI!;
  const dbName = process.env.MONGODB_DB_NAME!;

  await mongoose.connect(uri, { dbName });

  try {
    // db.users.drop() 相当
    // Mongoose では Model.collection.drop()
    await UserModel.collection.drop();

    // insertMany
    await UserModel.insertMany([
      { name: "Alice", age: 20 },
      { name: "Bob", age: 22 },
      { name: "Carol", age: 19 },
    ]);

    // find + sort
    // .lean() を付けると素の JS オブジェクトになる（printjson に近い）
    const result = await UserModel.find({ age: { $gte: 20 } })
      .sort({ age: -1 })
      .lean();

    // printjson 相当
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
