const Engine = require("./index.js");

//set main correct engine
function getMainEngine() {
  let mainEngine = new Engine.Engine();
  mainEngine.setInputs([{ name: "wind speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }] }]);
  mainEngine.setOutputs([{ name: "evaporation ratio", options: [{ name: "low", points: [0, 0.5] }, { name: "high", points: [0.4, 1] }] }]);
  //mainEngine.setLogicalUnits();
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
  return mainEngine;
}

test('Exception on empty engine', () => {
  let engine = new Engine.Engine();
  expect(() => engine.query()).toThrow("Empty engine");
});

test('Exception on less than two option on a parameter', () => {
  let mainEngine = getMainEngine();
  mainEngine.setLogicalUnits([{ name: "speed", options: [{ name: "low", points: [0, 10] }] }]);
  expect(() => mainEngine.query()).toThrow("There should have at least two options");
});

test('Exception on not having start & end option on a parameter', () => {
  let mainEngine = getMainEngine();
  mainEngine.setLogicalUnits([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [5, 10, 15] }] }]);
  expect(() => mainEngine.query()).toThrow("There should have start & end point");
});

test('Exception on having two start or two end', () => {
  let mainEngine = getMainEngine();
  mainEngine.setInputs([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [11, 10] }] }]);
  expect(() => mainEngine.query()).toThrow("There should have only one start point & only one end point");
});

test('Exception on more than 4 point on a option', () => {
  let mainEngine = getMainEngine();
  mainEngine.setLogicalUnits([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }, { name: "high", points: [5, 6, 7, 8, 9] }] }]);;
  expect(() => mainEngine.query()).toThrow('Options should only have maximum 4 points');
});

test('Exception on options with same name', () => {
  let mainEngine = getMainEngine();
  mainEngine.setLogicalUnits([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "low", points: [8, 11] }] }]);;

  expect(() => mainEngine.query()).toThrow('Options should not have the same name');
});

test('Exception on parameters with the same name', () => {
  let mainEngine = getMainEngine();
  mainEngine.setLogicalUnits([{ name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }] },
  { name: "speed", options: [{ name: "low", points: [0, 10] }, { name: "high", points: [8, 11] }] }]);;

  expect(() => mainEngine.query()).toThrow('Parameters should not have the same name');
});

test('Exception on not covering axis by any option', () => {
  let mainEngine = getMainEngine();

  mainEngine.setLogicalUnits([{
    name: "speed", options:
      [{ name: "low", points: [0, 7] }, { name: "high", points: [8, 11] }]
  }]);;

  expect(() => mainEngine.query()).toThrow('Options should cover all axis');
});