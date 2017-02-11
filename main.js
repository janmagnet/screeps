var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var roles = {
    harvester: {
        minimum: 6,
        parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        workFunc: roleHarvester.run
    },
    upgrader: {
        minimum: 8,
        parts: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
        workFunc: roleUpgrader.run
   },
    repairer: {
        minimum: 2,
        parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        workFunc: roleRepairer.run
    },
    builder: {
        minimum: 2,
        parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
    for (var roleName in roles) {
        var role = roles[roleName];
        var creepCount = _.sum(creeps, (c) => c.memory.role == roleName);
        if (creepCount < role.minimum) {
            var name = spawn.createCreep(role.parts, undefined, { role: roleName, working: false});
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
