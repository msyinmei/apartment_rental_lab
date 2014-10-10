"use strict"
var menu = require('node-menu');
var app = require('./app.js');

var building = new app.Building("Waterfront Tower");
var people = [];

var findPerson = function (pName) {
  for (var i = 0; i < people.length; i++){
    if (people[i].name === pName) {
      return people[i];
    }
  }
  return null;
};

var findUnit = function (unit_number){
  for (var i = 0; i < building.units.length; i++){
    if (building.units[i].number == unit_number) {
      return building.units[i];
    }
  }
  return null;
};

// Add some seed data

people.push(new app.Person("Anna", "765-4321"));
var john = new app.Manager("John", "700-4321");
building.setManager(john);
people.push(john);
var devin = new app.Tenant("Devin", "765-1234");
devin.addReference(new app.Person("Carl", "415 3536 222"));
devin.addReference(new app.Person("Steve", "415 1111 222"));
people.push(devin);
people.push(new app.Tenant("Steve", "744-1234"));

building.units.push(new app.Unit("12", building, 400, 2000));
building.units.push(new app.Unit("13", building, 800, 3000));
building.units.push(new app.Unit("14", building, 1800, 4500));

// --------------------------------
menu.addDelimiter('-', 40, building.address + " rental app");

menu.addItem('Add manager',
  function(name, contact) {
    var aManager = new app.Manager(name, contact);
    aManager.addBuilding(building);
    building.setManager(aManager);
    people.push(new app.Manager(name, contact));
  },
  null,
  [{'name': 'name', 'type': 'string'}, {'name': 'contact', 'type': 'string'}]
);

menu.addItem('Add tenant',
  function(name, contact) {
    people.push(new app.Tenant(name, contact));
  },
  null,
  [{'name': 'name', 'type': 'string'}, {'name': 'contact', 'type': 'string'}]
);

menu.addItem('Show tenants:',
  function() {
    for (var i = 0; i <= people.length; i++) {
      if (people[i] instanceof app.Tenant){
        console.log("\n" + people[i].name + " " + people[i].contact);
        var references = people[i].references;
        if(!references) {continue;}
        for (var j = references.length - 1; j >= 0; j--) {
          console.log("-> Reference: " + references[j].name + " " + references[j].contact);
        }
      }
    }
  }
);

menu.addItem('Add unit',
  function(number, sqft, rent) {
    var aUnit = new app.Unit(number, building, sqft, rent);
    building.units.push(aUnit);
  },
  null,
  [{'name': 'number', 'type': 'string'},
    {'name': 'sqft', 'type': 'numeric'},
    {'name': 'rent', 'type': 'numeric'}]
);

menu.addItem('Show all units',
  function() {
    for(var i = building.units.length - 1; i >= 0; i--) {
      if (building.units[i].tenant !== null){
          console.log(" tenant: " + building.units[i].tenant.name +
          " num: " + building.units[i].number +
          " sqft: " + building.units[i].sqft +
          " rent: $" + building.units[i].rent);
      } else {
      console.log(" tenant: " + building.units[i].tenant +
      			  " num: " + building.units[i].number +
                  " sqft: " + building.units[i].sqft +
                  " rent: $" + building.units[i].rent);
    }
    }
  }
);

menu.addItem('Show available units',
  function() {
    for(var i = building.units.length - 1; i >= 0; i--) {
        if (building.units[i].tenant === null) {
      console.log(" tenant: " + building.units[i].tenant +
              " num: " + building.units[i].number +
                  " sqft: " + building.units[i].sqft +
                  " rent: $" + building.units[i].rent);
        }
    }
  }
);

menu.addItem('Add tenant reference',
  function(tenant_name, ref_name, ref_contact) {
      var tenant = findPerson(tenant_name);
      // console.log (tenant);
      if (tenant instanceof app.Tenant){
        var ref = findPerson(ref_name);
          // if (ref === undefined) {
            ref = new app.Person(ref_name, ref_contact);
            people.push(ref);
            tenant.addReference(ref);
          // } else {
          //   tenant.addReference(ref);
          // }
        console.log('Success! tenant: ' + tenant_name +
              ' reference: ' + ref_name +
              ' ref contact: ' + ref_contact);
      } else {
        console.log ('Error: tenant does not exist.');
      }

      // for (var i = 0; i <= people.length; i++) {
      //   if (people[i] instanceof app.Tenant){
      //     if (people[i].name === tenant_name) {
      //         people[i].addReference(new app.Person(ref_name, ref_contact));
      //         console.log('Success! tenant: ' + tenant_name +
      //         ' reference: ' + ref_name +
      //         ' ref contact: ' + ref_contact);
      //     } else {
      //       console.log ('Error: tenant does not exist.');
      //     }
      //   }
      // }
    },
    null,
    [{'name': 'tenant_name', 'type': 'string'},
    {'name': 'ref_name', 'type': 'string'},
    {'name': 'ref_contact', 'type': 'string'}]
);

menu.addItem('Move tenant in unit',
  function(unit_number, tenant_name) {
      // find tenant and unit objects, use building's addTenant() function.
      var tenant = findPerson(tenant_name);
      var unit = findUnit(unit_number);
      console.log('Unit: ' + unit);
      console.log('Tenant: '+ tenant);
      if (unit.available() === true){
        building.addTenant(unit, tenant);
        console.log(tenant_name + " is now the tenant of unit#" + unit_number);
      } else {
        console.log("Unit is not available or tenant is non-existent");
      }
      },
    null,
    [{'name': 'unit_number', 'type': 'string'},
    {'name': 'tenant_name', 'type': 'string'}]
);

menu.addItem('Evict tenant',
  function(tenant_name) {
    var tenant = findPerson(tenant_name);
    if (tenant !== null){
      for (var i = 0; i < building.units.length; i++){
        if (building.units[i].tenant === tenant) {
        var unit = building.units[i];
            building.removeTenant(unit, tenant);
            console.log("We have evicted " + tenant_name + " from unit#" + building.units[i].number);
          }
        }
    } else {
          console.log("the person you requested is not a tenant");
    }
  },
    null,
    [{'name': 'tenant_name', 'type': 'string'}]
);

menu.addItem('Show total sqft rented',
  function() {
    var total = 0;
    for(var i = building.units.length - 1; i >= 0; i--){
      if (building.units[i].tenant !== null){
        total += building.units[i].sqft;
        console.log(" sqft:" + total);
      }
    }
    // var add = function(a,b){return a + b;};
    //   for (var i = 0; i < building.units.length; i++){
    //     if (building.units[i].available === false) {
    //       rentedUnits.push(building.units[i].sqft);
    //     }
    // console.log(rentedUnits.reduce(add()));
    //   }
    //   null;
  }
);

menu.addItem('Show total yearly income',
  function() {
  var total = 0;
  for(var i = building.units.length - 1; i >= 0; i--) {
        if (building.units[i].tenant !== null){
        total += building.units[i].rent;
        console.log(" rent: $" + total);
          }
        }
       }
);

menu.addItem('Show total number of units rented',
  function() {
  var total = 0;
  for(var i = building.units.length - 1; i >= 0; i--) {
        if (building.units[i].tenant !== null){
        total += 1;
        console.log("total units rented: " + total);
          }
        }
       }
);

// *******************************
menu.addDelimiter('*', 40);

menu.start();