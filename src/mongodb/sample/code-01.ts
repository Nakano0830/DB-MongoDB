// 実行方法
// npm run dev src/mongodb/sample/code-01.ts

import "dotenv/config";
import { MongoClient } from "mongodb";

type User = {
  name: string;
  age: number;
};

const main = async () => {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);

  await client.connect();

  try {
    const db = client.db(process.env.MONGODB_DB_NAME!);
    const users = db.collection<User>("p_users");

    await users.drop();

    // insertMany
    await users.insertMany([
      { name: "Alice", age: 20 },
      { name: "Bob", age: 22 },
      { name: "Carol", age: 19 },
    ]);

    // find + sort + toArray
    const result = await users
      .find({ age: { $gte: 20 } })
      .sort({ age: -1 })
      .toArray();

    // printjson 相当
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await client.close();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
