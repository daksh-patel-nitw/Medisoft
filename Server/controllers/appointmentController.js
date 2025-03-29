import appointmentModel from '../models/appointment.js'
import { addTimings, removeTimings } from '../services/getDoctorTimings.js';
import generateBill from '../utils/billUtils.js';
import { updateMember } from './memberController.js';
import { prescribeTest, getTests } from './labController.js';
import { prescribeMedicine, getMedicine } from './medicinesController.js';
import { getRoomWithAid } from './roomController.js';
import mongoose from 'mongoose';

export const bookAppointment = async (type, b) => {
  try {
    const newA = new appointmentModel({
      pid: b.pid,
      did: b.did,
      pname: b.pname,
      mobile: b.mobile,
      dname: b.dname,
      dep: b.dep,
    });

    if (type === "opd") {
      newA.status = 'P';
      newA.schedule_date = b.schedule_date;
      newA.time = b.time;
      newA.doctor_qs = b.qs;
      newA.price = b.price;

      //updating the opd status of the patient to avoid multiple bookings.
      await updateMember(b.pid, { opd: 1 });

      // Updating the time slots of the doctor after booking
      await addTimings(b.schedule_date, b.did, b.time, b.count - 1);

    } else {
      newA.status = 'I';
      newA.schedule_date = Date.now();
    }

    await newA.save();
    console.log(newA);
    return newA._id;
  } catch (error) {
    console.error(error);
    throw new Error("Error booking appointment");
  }

}

export const makeAppointment = async (req, res) => {
  const b = req.body;
  console.log(b);
  const { type } = req.params;
  try {
    const aid = await bookAppointment(type, b);
    res.status(200).json({ message: "Booking is Successfull", show: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Patient screen: Get all patient appointments
export const getPatientApp = async (req, res) => {
  try {
    const { pid } = req.params;
    const appointments = await appointmentModel.find({ pid });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient appointments", error });
  }
};

// Doctor's appointments list
export const getDoctorApps = async (req, res) => {
  try {
    const { did } = req.params;
    const appointments = await appointmentModel.find({ did }).sort({ createdAt: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor appointments", error });
  }
};


//Confirm Appointment on Counter-2
export const confirmAppointment = async (req, res) => {
  const { _id, selected_doctor_qs, weight, height } = req.body;

  try {
    const updatedP = await appointmentModel.findByIdAndUpdate(
      _id,
      { status: 'confirm', ctime: Date.now(), selected_doctor_qs, weight, height },
      { new: true }
    );
    console.log(updatedP);

    // pid, price, aid, description, type, did = null , date = new Date()

    await generateBill(updatedP.pid, updatedP.price, updatedP.aid, "Doctor Fees", 'doctor', updatedP.did);
    // console.log("Bill in Route:", newBill)

    res.status(200).json({ message: "Confirmed Successfully.", show: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//Get Appointmentss on Counter-2
export const getCounter2app = async (req, res) => {
  try {
    const { dep } = req.params;
    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);

    const apps = await appointmentModel.find(
      {
        dep: dep,
        schedule_date: { $gte: start, $lt: end },
        status: "P"
      },
      { pid: 1, pname: 1, mobile: 1, dname: 1, time: 1, status: 1, doctor_qs: 1, weight: 1 }
    );

    // console.log(apps);

    res.status(200).json(apps);
  } catch (error) {
    console.error("Error fetching counter appointments:", error);
    res.status(500).json({ message: "Error fetching counter appointments", error });
  }
};

//Cancel the appointment
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  console.log("Received ID in backend:", id);
  try {
    const { id } = req.params;
    console.log(id);

    const updatedAppointment = await appointmentModel.findOneAndUpdate(
      { _id: id },
      { status: "cancel" },
      { new: true }
    );

    //updating the count of the doctor after cancelling the appointment
    await removeTimings(updatedAppointment.schedule_date, updatedAppointment.did, updatedAppointment.time);

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment cancelled successfully", show: true });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Error canceling appointment", error });
  }
};

//Doctor Diagnosis done in opd
export const diagnoseOpd = async (req, res) => {
  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction();

  try {
    const { notes, medicines, tests, _id } = req.body;

    //Step 1: Update the appointment status
    const updatedAppointment = await appointmentModel.findOneAndUpdate(
      { _id: _id },
      {
        status: "D",
        notes,
        discharge_date: new Date(),
      },
      { new: true, session } // Use the transaction session
    );

    if (!updatedAppointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Appointment not found", show: true });
    }

    //Step 2: Prescribe Medicines
    const status1 = await prescribeMedicine(_id, medicines, session);
    if (!status1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: "Failure in adding Medicines", show: true });
    }

    //Step 3: Prescribe Tests
    const status2 = await prescribeTest(_id, tests, session);
    if (!status2) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: "Failure in adding Tests", show: true });
    }

    //Commit the transaction if all steps succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Diagnosis updated successfully", show: true });

  } catch (error) {
    await session.abortTransaction(); // Rollback changes
    session.endSession();
    console.error("Error updating diagnosis:", error);
    res.status(500).json({ message: "Error updating diagnosis", error });
  }
};

const getMedicineAndTest = async (aid, index) => {
  try {
    const medicines = await getMedicine(aid, index);
    const tests = await getTests(aid, index);
    return { medicines: medicines, tests: tests };
  }
  catch (error) {
    console.error("Error fetching medicines and tests:", error);
    throw new Error("Error fetching medicines and tests");
  }
};

// Doctor screen: View patient's previous appointments
export const getAllPatientApps = async (req, res) => {
  try {
    const { pid, did } = req.params; // Get parameters from the request

    // Corrected sorting
    const appointments = await appointmentModel.find({ pid, did, status: 'D' }).sort({ discharge_date: -1 });

    // Convert to plain objects and fetch medicines/tests in parallel
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (app) => {
        const { medicines, tests } = await getMedicineAndTest(app._id, 1);
        return { ...app.toObject(), medicines, tests }; // Convert to object and add properties
      })
    );

    res.status(200).json(appointmentsWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get all IPD patients for the doctor
export const getIPDPatients = async (req, res) => {
  try {
    const { did } = req.params;
    const patients = await appointmentModel.find({ did, status: 'I' }, { pname: 1, mobile: 1, pid: 1, createdAt: 1 });

    res.status(200).json(patients);
  }
  catch (error) {
    console.error("Error fetching IPD patients:", error);
    res.status(500).json({ message: "Error fetching IPD patients", error });
  }
};

// Get IPD appointment of a patient for the doctor
export const getIPDAppointment = async (req, res) => {

  try {
    const { did, pid } = req.params;
    const appointment = await appointmentModel.findOne({ did, pid, status: 'I' }).lean();
    if (!appointment) {
      return res.status(404).json({ message: "No IPD appointment found", show: true });
    }

    const aid = appointment._id.toString();

    console.log("Appointment ID:", aid);
    const { medicines, tests } = await getMedicineAndTest(aid, 0);

    console.log(medicines, tests);
    // -------- Group by date --------
    const groupedData = {};

    // First, group medicines by date
    medicines.forEach(med => {
      groupedData[med.date] = groupedData[med.date] || { date: med.date, medicines: [], tests: [] };
      groupedData[med.date].medicines.push(...med.medicines);
    });

    // Then, group tests by date
    tests.forEach(test => {
      groupedData[test.date] = groupedData[test.date] || { date: test.date, medicines: [], tests: [] };
      groupedData[test.date].tests.push(...test.tests);
    });

    // Get the room details
    const room=await getRoomWithAid(aid)

    // Convert groupedData into an array
    const result = Object.values(groupedData);

    res.status(200).json({dep:room.dep,room:room.room_no,data:result});

  } catch (error) {
    console.error("Error fetching IPD appointment:", error);
    res.status(500).json({ message: "Error fetching IPD appointment", error });
  }
};


// Get OPD appointment for the doctor (First, find 'confirm' status, then 'progress' status)
export const getOPDappointment = async (req, res) => {
  try {
    const { did } = req.params;
    console.log(did);

    // Run both queries in parallel to reduce database calls
    const [appointmentToUpdate, inProgress] = await Promise.all([
      appointmentModel.findOne({ did: did, status: 'confirm' }).sort({ ctime: 1 }),
      appointmentModel.findOne({ did: did, status: 'progress' })
    ])

    if (inProgress) {
      return res.status(200).json(inProgress);
    } else if (appointmentToUpdate) {
      await appointmentModel.updateOne(
        { _id: appointmentToUpdate._id },
        { $set: { status: 'progress' } },
        { returnOriginal: false }
      );
      return res.status(200).json(appointmentToUpdate);
    } else {
      return res.status(404).json({ message: 'No confirmed appointments found for this doctor', warn: true });
    }
  } catch (error) {
    console.error("Error fetching IPD appointment:", error);
    res.status(500).json({ message: "Error fetching IPD appointment", error });
  }
};

// Get IPD appointment list for the doctor
export const getIpdappointmentList = async (req, res) => {
  try {
    const { did } = req.params; // Use route params for doctor ID
    const appointments = await appointmentModel.find({ did: did, status: 'I' });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching IPD appointments:", error);
    res.status(500).json({ message: "Error fetching IPD appointments", error });
  }
};

// Update IPD patient details
export const updateIPDpat = async (req, res) => {

  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction();
  console.log(req.body);
  try {
    const { notes, medicines, tests, _id } = req.body;

    //Step 1: Update the appointment status
    if (notes) {
      console.log("here");
      const updatedAppointment = await appointmentModel.findOneAndUpdate(
        { _id: _id },
        {
          notes,
        },
        { new: true, session } // Use the transaction session
      );

      if (!updatedAppointment) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Appointment not found", show: true });
      }
    }


    //Step 2: Prescribe Medicines
    const status1 = await prescribeMedicine(_id, medicines, session);
    if (!status1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: "Failure in adding Medicines", show: true });
    }

    //Step 3: Prescribe Tests
    const status2 = await prescribeTest(_id, tests, session);
    if (!status2) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: "Failure in adding Tests", show: true });
    }

    //Commit the transaction if all steps succeed
    await session.commitTransaction();


    res.status(200).json({ message: "Diagnosis updated successfully", show: true });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Error updating diagnosis:", error);
    res.status(500).json({ message: "Error updating diagnosis", error });
  } finally {
    session.endSession(); // Ensure the session is ended in the finally block
  }
};

// Display patient name on the queue screen
export const queuescreen = async (req, res) => {
  try {
    const { dep } = req.params; // Get department from params

    const appointments = await appointmentModel.aggregate([
      {
        $match: { dep, status: { $in: ['confirm', 'progress'] } }, // Filter appointments by department
      },
      {
        $sort: { status: -1, ctime: 1 }, // Sort appointments by ctime
      },
      {
        $group: {
          _id: "$did", // Group by doctor ID
          doctorName: { $first: "$dname" }, // Store doctor's name
          appointments: {
            $push: {
              pid: "$pid",
              pname: "$pname",
              status: "$status"
            },
          },
        },
      },

    ]);

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching queue screen data:", error);
    res.status(500).json({ message: "Error fetching queue screen data", error });
  }
};


// See appointments: Pending, Confirmed, and Diagnosed
export const seeappointment = async (req, res) => {
  try {
    const { id } = req.params; // Use route params for doctor ID

    // Correct use of Promise.all with parentheses
    const [p, c, d] = await Promise.all([
      appointmentModel.find({ did: id, status: 'P' }),
      appointmentModel.find({ did: id, status: 'confirm' }),
      appointmentModel.find({ did: id, status: 'D' })
    ]);

    const arr = [[...p], [...c], [...d]]; // Combine the results
    res.status(200).json(arr);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};
