require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var roles = {
    harvester: {
        minimum: 4,
        workFunc: roleHarvester.run
    },
    upgrader: {
        minimum: 3,
        workFunc: roleUpgrader.run
   },
    repairer: {
        minimum: 2,
        workFunc: roleRepairer.run
    },
    builder: {
        minimum: 2,
        workFunc: roleBuilder.run
     }
};

module.exports.loop = function() {
    clearMemory();
    
    var spawn = Game.spawns.Alpha;
    var creeps = Game.creeps;

    // Execute creep work.
    for (let name in creeps) {
        var creep = creeps[name];
        var creepRole = roles[creep.memory.role];
        if (creepRole != undefined) {
            creepRole.workFunc.apply(this, [creep]);
        } else {
            creep.say("DUMMY");
        }
    }
    
    // Spawn new creeps.
    for (let roleName in roles) {
        var role = roles[roleName];
        var creepCount = _.sum(creeps, (c) => c.memory.role == roleName);
        if (creepCount < role.minimum) {
            var energy = spawn.room.energyAvailable;
            var name = spawn.createCustomCreep(energy, roleName);
            if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
                console.log("Spawned new " + roleName + ": " + name);
                break;
            }
        }
    }

    function clearMemory() {
        var creepsMem = Memory.creeps;
        for (let name in creepsMem) {
            if (Game.creeps[name] == undefined) {
                delete creepsMem[name];
            }
        }
    }
}
