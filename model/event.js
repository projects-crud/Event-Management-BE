const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
  eventName: String,
  startDate: String,
  endDate: String,
  organizer: String,
  participants: Array
},{
    timestamps: true
}
);

module.exports = mongoose.model('Event', EventSchema);
