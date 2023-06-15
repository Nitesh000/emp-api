import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Emp } from "../model/emp";
dotenv.config();

const app = express();

// TODO: connection with the backend mongodb.
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// NOTE: express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: insert the data of an employee on the db.
app.post("/emp", async (req, res) => {
  try {
    const newData = new Emp(req.body);
    const savedData = await newData.save();
    if (!savedData) {
      res.status(404).json({ message: "unable to create an employee" });
    }
    res
      .status(200)
      .json({ message: "Employee created Successfully", NewEmp: savedData });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// TODO: get the data of an employee from the db.
app.get("/emp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultData = await Emp.findById(id);
    if (!resultData) {
      res.status(404).json({ message: "Unable to find data by this id" });
    }
    res
      .status(200)
      .json({ message: "Found the employee", employee: resultData });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// TODO: delete the data of an employee from the db.
app.delete("/emp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deltedData = await Emp.findByIdAndDelete(id);
    if (!deltedData) {
      res.status(404).json({ message: "Unable to find data by this id" });
    }
    res
      .status(200)
      .json({ message: "Employee data is deleted", employee: deltedData });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
// TODO: update the data of an employee from the db.
app.put("/emp/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedData = await Emp.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedData) {
      res.status(404).json({ message: "Unable to find data by this id" });
    }
    res
      .status(200)
      .json({
        message: "Employee data has been updated",
        employee: updatedData,
      });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
// TODO: get all employees data
app.get("/allemp", async (req, res) => {
  try {
    const allemp = await Emp.find({});
    if (!allemp) {
      res.status(404).json({ message: "Unable to fetch data" });
    }
    res.status(200).json({ message: "All emp data", employee: allemp });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.listen(3000, () => {
  console.log("Sever started on port 3000");
});
