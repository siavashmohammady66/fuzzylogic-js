const Engine = require("./index.js");

//set main correct engine
let mainEngine = new Engine.Engine();
//mainEngine.setInputs([{ name: "wind speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }] }]);
mainEngine.setOutputs([{ name: "evaporation ratio", options: [{ name: "low", points: [0, 0.5] }, { name: "high", points: [0.5, 1] }] }]);
//mainEngine.setLogicalUnits();
mainEngine.setInputs([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [0, 10] }] }]);
mainEngine.setLogicalUnits([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }] },
{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }] }]);;
mainEngine.setRules([
  {
    conditions: [{ name: "wind speed", predicate: "is", option: "high" }],
    result: { name: "evaporation ratio", predicate: "is", option: "high" }
  },
  {
    conditions: [{ name: "wind speed", predicate: "is", option: "low" }],
    result: { name: "evaporation ratio", predicate: "is", option: "low" }
  }
]);
console.log("before query");
mainEngine.query();