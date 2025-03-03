import appointmentModel from '../models/appointment.js'
import { addTimings } from '../services/getDoctorTimings.js';
import generateBill from '../utils/billUtils.js';

export const makeAppointment = async (req, res) => {
  const b = req.body;
  console.log(b);
  const { type } = req.params;
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

      await addTimings(b.schedule_date, b.did, b.time, b.count - 1);

    } else {
      newA.status = 'I';
      newA.schedule_date = Date.now();
    }

    await newA.save();
    console.log(newA);


    res.status(200).json({message:"Booking is Successfull",show:true});
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
  const { _id, doctor_qs, weight, height } = req.body;

  try {
    const updatedP = await appointmentModel.findByIdAndUpdate(
      _id,
      { status: 'confirm', ctime: Date.now(), doctor_qs, weight, height },
      { new: true }
    );
    console.log(updatedP);

    const newBill = await generateBill(updatedP.pid, updatedP.aid, updatedP._id, "Doctor Fees", 'doctor', updatedP.did);
    console.log("Bill in Route:", newBill)

    res.status(200).json({ message: "Updated Successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//Get Appoints on Counter-2
export const getCounter2app = async (req, res) => {
  try {
    const { dep } = req.params;
    const today = new Date().toISOString().split("T")[0]; // Ensure only the date part is used
    console.log("Today's date:", today);

    const apps = await appointmentModel.find(
      { dep, schedule_date: today, status: "P" },
      { pid: 1, pname: 1, mobile: 1, dname: 1, time: 1, status: 1, doctor_qs: 1, weight: 1 }
    );

    res.status(200).json(apps);
  } catch (error) {
    console.error("Error fetching counter appointments:", error);
    res.status(500).json({ message: "Error fetching counter appointments", error });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await appointmentModel.findOneAndUpdate(
      { _id: id },
      { status: "cancel" },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment canceled successfully", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Error canceling appointment", error });
  }
};

//Doctor Diagnosis done in opd
export const diagnoseOpd = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, title, medicines, tests } = req.body;

    const updatedAppointment = await appointmentModel.findOneAndUpdate(
      { _id: id },
      {
        status: "D",
        notes,
        discharge_date: new Date(),
        title,
        medicines,
        tests
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Diagnosis updated successfully", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating diagnosis:", error);
    res.status(500).json({ message: "Error updating diagnosis", error });
  }
};


// Doctor screen: View patient's previous appointments
export const getAllPatientApps = async (req, res) => {
  try {
    const { pid, did } = req.params; // Get parameters from the request
    const appointments = await appointmentModel.find({ pid, did, status: 'D' });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get IPD appointment for the doctor (First, find 'confirm' status, then 'progress' status)
export const getIpdappointment = async (req, res) => {
  try {
    const { did } = req.body;
    console.log(did);

    // Run both queries in parallel to reduce database calls
    const [appointmentToUpdate, inProgress] = await Promise.all([
      appointmentModel.findOne({ did: did, status: 'confirm' }).sort({ ctime: 1 }),
      appointmentModel.findOne({ did: did, status: 'progress' }).sort({ ctime: 1 })
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
      return res.status(404).json({ message: 'No confirmed appointments found for this doctor' });
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
  try {
    const updatedEmployee = req.body; // Get the updated employee data from the request body
    const updatedAppointment = await appointmentModel.findOneAndUpdate(
      { _id: updatedEmployee._id },
      { $set: updatedEmployee },
      { new: true }
    );
    console.log("Update result:", updatedAppointment);
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating IPD patient", error });
  }
};

// Display patient name on the queue screen
export const queuescreen = async (req, res) => {
  try {
    const { did } = req.params; // Use route params for doctor ID
    const app1 = await appointmentModel.findOne({ did: did, status: 'progress' }, { pname: 1, pid: 1, status: 1, ctime: 1 }).sort({ ctime: 1 });
    console.log(did);
    const app = await appointmentModel.find({ did: did, status: 'confirm' }, { pname: 1, pid: 1, status: 1, ctime: 1 }).sort({ ctime: 1 });
    console.log(app1);

    let t;
    if (app1) {
      t = [app1, ...app];
    } else {
      t = app;
    }

    console.log(did, t);
    res.status(200).json(t);
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





