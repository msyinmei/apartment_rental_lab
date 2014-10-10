var Person = require("./person.js");

function Tenant(name, contact, income) {
  Person.call(this,name,contact);
  this.income = income;
  this.references = [];
}

// Set prototype and constructor
Tenant.prototype = new Person();
Tenant.prototype.constructor = Tenant;

Tenant.prototype.addReference = function(reference){
  if (reference instanceof Person) {
    this.references.push(reference);
  }
};

Tenant.prototype.removeReference = function(reference) {
  this.references.splice(this.references.indexOf(reference),1);
};

module.exports = Tenant;
