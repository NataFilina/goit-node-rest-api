import mongoose from "mongoose";

const DB_TEST_URI = process.env.DB_TEST_URI;

mongoose
  .connect(DB_TEST_URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error", err);
    process.exit(1);
  });
