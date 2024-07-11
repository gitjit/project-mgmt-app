// Project Schema
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
  },
});

//module.exports(mongoose.model("Client", clientSchema));

module.exports = mongoose.model("Project", projectSchema);
