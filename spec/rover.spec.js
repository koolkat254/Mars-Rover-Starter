const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

// let testRover = new Rover(100);
// let testCommands = [
//   new Command("MOVE", 4321),
//   new Command("STATUS_CHECK"),
//   new Command("MODE_CHANGE", "LOW_POWER"),
//   new Command("MOVE", 3579),
//   new Command("STATUS_CHECK"),
// ];
// let testMessage = new Message("TA power", testCommands);
// let testResponse = testRover.receiveMessage(testMessage);

describe("Rover class", function () {
  it("constructor sets position and default values for mode and generatorWatts", function () {
    let testRover = new Rover();
    expect(testRover.mode).toBe("NORMAL");
    expect(testRover.generatorWatts).toBe(110);
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    let testRover = new Rover();
    let testMessage = new Message("TA power", []);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.messageName).toBe("TA power");
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let testRover = new Rover();
    let testMessage = new Message("TA power", [
      new Command("MOVE", 4321),
      new Command("STATUS_CHECK"),
    ]);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.results.length).toBe(2);
  });

  it("responds correctly to the status check command", function () {
    let testRover = new Rover(1234);
    let testMessage = new Message("TA power", [new Command("STATUS_CHECK")]);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.results[0].roverStatus.mode).toBe("NORMAL");
    expect(testResponse.results[0].roverStatus.generatorWatts).toBe(110);
    expect(testResponse.results[0].roverStatus.position).toBe(1234);
  });

  it("responds correctly to the mode change command", function () {
    let testRover = new Rover(1234);
    let testMessage = new Message("TA power", [
      new Command("STATUS_CHECK"),
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ]);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.results[0].roverStatus.mode).toBe("NORMAL");
    expect(testResponse.results[2].roverStatus.mode).toBe("LOW_POWER");
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let testRover = new Rover(1234);
    let testMessage = new Message("TA power", [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 3579),
    ]);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.results[1].completed).toBe(false);
  });

  it("responds with the position for the move command", function () {
    let testRover = new Rover(1234);
    let testMessage = new Message("TA power", [
      new Command("MOVE", 3579),
    ]);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testRover.position).toBe(3579);
  });
});
