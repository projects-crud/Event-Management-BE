const express = require("express");
const router = express.Router();
const csvtojson = require("csvtojson");
const Event = require("../model/event");
const multer = require("multer");
const nodeMailer = require("nodemailer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodeMailer.createTransport({
  service: "gmail",
  secure: true,
  host: "smtp.forwardemail.net",
  port: 465,
  auth: {
    user: "eventmanagement098@gmail.com",
    pass: "oekl mlya smnw wmgk",
  },
});

router.post("/events", upload.single("csvFile"), async (req, res) => {
  try {
    const csvData = req.file.buffer.toString();
    const participantlist = await csvtojson()
      .fromString(csvData)
      .then((data) => {
        return data;
      });
    // console.log(participantlist, "participantlist");
    const { eventName, startDate, endDate, organizer } = req.body;
    const newEvent = new Event({
      eventName: eventName,
      startDate: startDate,
      endDate: endDate,
      organizer: organizer,
      participants: participantlist,
    });
    await newEvent.save();
    res.status(201).json(" Created!");
  } catch (error) {
    res.status(500).json("Error: Please Check the error");
  }
});

// Get all events

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// update

router.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const updateEvent = await Event.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateEvent);
  } catch (error) {
    res.status(500).json("internal error");
  }
});

// Delete

router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Event.findOneAndDelete({ _id: id });
    res.status(200).json("deleted");
  } catch {
    res.status(500).json("something went wrong");
  }
});

// Get Single Event

router.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const singleId = await Event.findById(id);
    res.status(200).json(singleId);
  } catch (error) {
    res.status(500).json("error");
  }
});

// Schedule

router.put("/events/:id/:participantid", async (req, res) => {
  const { id, participantid } = req.params;
  const { startTime, endTime } = req.body;
  console.log(startTime, endTime, "type");

  try {
    const event = await Event.findById(id);
    const participant = event.participants.map((participant) => {
      if (participant.ID == participantid) {
        (participant["startTime"] = startTime),
          (participant["endTime"] = endTime);

        var mailOptions = {
          from: "eventmanagement098@gmail.com",
          to: `${participant.Email}`,
          subject: "Event Management Schedule",
          text: `The organiser of ${event.eventName} event, ${event.organizer} sends an invite to ${participant.chapterName} for a virtual meet under the category of ${category} at the time-slot between ${startTime} - ${endTime}`,
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info, "info");
          }
        });
      }
      return participant;
    });
    
    await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          participants: participant,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json("edited");
  } catch (error) {
    res.status(500).json("error");
  }
});

module.exports = router;