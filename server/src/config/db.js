import mongoose from "mongoose";

// Get url from mongo atlas

// MONGO_URI=mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongoDB connected !");
    })
    .catch((err) => console.log("err.message", err.message));
};

export default db;
