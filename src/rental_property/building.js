"use strict"

function Building(address) {
  this.address = address;
  this.units = [];
  this.manager = null;
}

Building.prototype.setManager = function(person) {
  // set this.manager to person. Person needs to be of type Manager.
  if (person.constructor.name === "Manager") {
  this.manager = person;
  }
};

Building.prototype.getManager = function(){
  return this.manager;
};

Building.prototype.addTenant = function(unit, tenant){
  // add tenant but check to make sure there
  // is a manager first and a tenant has 2 references
  // Note that tenant does not belong to Building, but to Unit
  // ...
  // Check if unit is in this.units
  // the actual units themselves are objects {tenant:"Yin"} for example.
  var index = this.units.indexOf(unit);
    if(index !== -1 && this.manager !== null && tenant.references.length >= 2 && tenant.constructor.name === "Tenant" && unit.available() === true){
      // this.units[uIndex].tenant = tenant;
      // this.units[uIndex].isAvailable = false;
      unit.tenant = tenant;
    }
  };

Building.prototype.removeTenant = function(unit, tenant) {
  // remove tenant
  var index = this.units.indexOf(unit);
    if(index !== -1 && this.manager !== null && tenant.references.length >= 2 && tenant.constructor.name === "Tenant" && unit.available() === false){
    unit.tenant = null;
  }
};

Building.prototype.availableUnits = function(){
  // return units available
    return this.units.filter(function(unit){
    return unit.available();
  });
};

Building.prototype.rentedUnits = function(){
  // return rented units
  // ...
return this.units.filter(function(unit){
    return !unit.available();
  });
};

module.exports = Building;
