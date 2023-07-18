var _ = require('lodash');

let Engine = class {
  constructor() {
    this.rules = [];
    this.inputs = [];
    this.logicalUnits = [];
    this.outputs = [];
  }

  setRules(rules) {
    this.rules = rules;
  }

  setInputs(inputs) {
    this.inputs = inputs;
  }

  setLogicalUnits(logicalUnits) {
    this.logicalUnits = logicalUnits;
  }

  setOutputs(outputs) {
    this.outputs = outputs;
  }

  checkParametersNotEmpty() {
    //check outputs
    if (this.outputs.length === 0 || this.rules.length === 0 || this.inputs.length === 0) {
      throw "Empty engine";
    }
  }

  checkHasExaclyOneStartOneEnd(start_end) {
    console.log(start_end);
    if (start_end[0].points[0] < start_end[0].points[1] && start_end[1].points[0] < start_end[1].points[1]) {
      return true;
    }

    return false;
  }

  validateParameter(param) {
    //console.log(param);
    let options = param.options;
    if (options.length < 2) {
      console.log("Parameter " + param.name + " should have at least two options")
      throw "There should have at least two options";
    }
    let startEndPoints = _.filter(options, (option) => option.points.length === 2);
    if (startEndPoints.length != 2) {
      console.log("Parameter " + param.name + " should have start & end point")
      throw "There should have start & end point";
    }
    if (startEndPoints[0].points[0] >= startEndPoints[0].points[1] || startEndPoints[1].points[0] >= startEndPoints[1].points[1]) {
      console.log("Parameter " + param.name + " has two starts or two ends!")
      throw "There should have only one start point & only one end point";
    }
    let morethan4Point = _.find(options, (option) => option.points.length > 4);
    if (morethan4Point != undefined) {
      console.log("Parameter " + param.name + " has a option with more than 4 points")
      throw 'Options should only have maximum 4 points';
    }
    let names = _.map(options, (option) => option.name);
    let uniqueNames = _.unionBy(names);

    if (uniqueNames.length < names.length) {
      console.log("Parameter " + param.name + " has options with same name")
      throw 'Options should not have the same name';
    }
    //'Options should cover all axis'
    //if first & last of two option has intersect they would be merged
    //merge until no merge possible or only remain one
    let optionsPoints = param.options.map(item => item.points);
    optionsPoints = _.orderBy(optionsPoints, (points) => _.last(points));
    while (optionsPoints.length > 1) {
      let merged = 0;
      for (let i = 0; i < optionsPoints.length; i++) {
        for (let j = i + 1; j < optionsPoints.length; j++) {

          if (i != j) {
            let pointLength = optionsPoints[i].length;
            if (optionsPoints[j][0] < optionsPoints[i][pointLength - 1]) {
              console.log("merge happened");
              let newItem = [optionsPoints[i][0], optionsPoints[j][0]];
              let minIndex = Math.min(i, j);
              let maxIndex = Math.max(i, j);
              optionsPoints.splice(maxIndex, 1);
              optionsPoints.splice(minIndex, 1);
              optionsPoints.push(newItem);
              continue;
            }
          }
        }
      }
      if (merged == 0 & optionsPoints.length > 1) {
        console.log("Parameter " + param.name + " has axis without covering by any option")
        throw 'Options should cover all axis';
      }
    }
  }

  validateparameters() {
    let parameters = this.inputs.concat(this.outputs).concat(this.logicalUnits);
    let validate = this.validateParameter;
    _.each(parameters, (param) => validate(param));
    let ParametersName = _.map(parameters, (parameter) => parameter.name);
    let uniqueParametersName = _.uniqBy(ParametersName);
    if (uniqueParametersName.length < ParametersName.length) {
      console.log("There shouldn't be parameters with same name");
      throw 'Parameters should not have the same name';
    }
  }

  query() {
    this.checkParametersNotEmpty();
    this.validateparameters();
  }
}
//let e = new Engine();
//console.log("here", e.query());
//engine
//rules
//inputs
//outputs
//calculation
//this should be change
module.exports.Engine = Engine;
