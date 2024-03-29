import mongoose from "mongoose";

let DB_URI = process.env.DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.DB_TEST_URI;
}
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error", err);
    process.exit(1);
  });
