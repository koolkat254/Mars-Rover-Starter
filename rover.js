const Message = require("./message");
const Command = require("./command");

class Rover {
  constructor(position) {
    this.position = position;
    this.mode = "NORMAL";
    this.generatorWatts = 110;
  }
 

  receiveMessage(message) {
    let messageName = message.name;
    let results = [];
    for (let command of message.commands) {
      let result = {};
      if (command.commandType == "MODE_CHANGE") {
        this.mode = command.value;
        result["completed"] = true;
      } else if (command.commandType == "MOVE") {
        if (this.mode == "NORMAL") {
          this.position = command.value;
          result["completed"] = true;
        } else {
          result["completed"] = false;
        }
      } else if (command.commandType == "STATUS_CHECK") {
        result["roverStatus"] = {
          mode: this.mode,
          generatorWatts: this.generatorWatts,
          position: this.position,
        };
      }

      results.push(result);
    }
    return { messageName, results };
  }
}

let rover = new Rover(100);
let commands = [
  new Command("MOVE", 4321),
  new Command("STATUS_CHECK"),
  new Command("MODE_CHANGE", "LOW_POWER"),
  new Command("MOVE", 3579),
  new Command("STATUS_CHECK"),
];
let message = new Message("TA power", commands);
let response = rover.receiveMessage(message);
console.log(rover);
console.log(JSON.stringify(response, null, 2));

module.exports = Rover;
