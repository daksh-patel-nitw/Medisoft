import request from "supertest";
import app from "../app"; // Adjust the path based on your project structure
import memberModel from "../models/memberModel"; // Adjust the path as needed
import mongoose from "mongoose";

// Mock the generateId function
jest.mock("../utils/generateId", () => ({
  generateId: jest.fn().mockResolvedValue("12345"),
}));

describe("POST /addMember", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("✅ Should successfully add a patient", async () => {
    const patientData = {
      fname: "John",
      middlename: "Doe",
      lname: "Smith",
      mobile: "1234567890",
      email: "john@example.com",
      dob: "2000-01-01",
      address: "123 Street",
      city: "New York",
      pincode: "10001",
      gender: "M",
      allergy: "None",
      conditions: "Diabetes",
      others: "None",
    };

    const res = await request(app).post("/addMember/patient").send(patientData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mid", "P12345");
    expect(res.body.type).toBe("patient");
    expect(res.body.fname).toBe(patientData.fname);
    expect(res.body.allergy).toBe(patientData.allergy);
  });

  test("✅ Should successfully add an employee", async () => {
    const employeeData = {
      fname: "Jane",
      middlename: "A",
      lname: "Doe",
      mobile: "9876543210",
      email: "jane@example.com",
      dob: "1995-05-05",
      address: "456 Avenue",
      city: "Los Angeles",
      pincode: "90001",
      gender: "F",
      degree: "MBBS",
      college: "Harvard",
      dep: "Cardiology",
    };

    const res = await request(app).post("/addMember/employee").send(employeeData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mid", "E12345");
    expect(res.body.type).toBe("employee");
    expect(res.body.fname).toBe(employeeData.fname);
    expect(res.body.degree).toBe(employeeData.degree);
  });

  test("❌ Should return 500 for invalid type", async () => {
    const invalidData = { fname: "Random", lname: "Person" };
    const res = await request(app).post("/addMember/unknown").send(invalidData);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });
});
