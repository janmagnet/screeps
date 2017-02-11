var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var roles = {
    harvester: {
        minimum: 6
    },
    upgrader: {
        minimum: 8
    },
    builder: {
        minimum: 2
    },
    repairer: {
        minimum: 2
    }
};

module.exports.loop = function() {
    clearMemory();
    
    var spawn = Game.spawns.Alpha;
    var creeps = Game.creeps;

    for (let name in creeps) {
        var creep = creeps[name];
        
        switch (creep.memory.role) {
            case "harvester": roleHarvester.run(creep); break;
            case "upgrader": roleUpgrader.run(creep); break;
            case "builder": roleBuilder.run(creep); break;
            case "repairer": roleRepairer.run(creep); break;
            default: creep.say("DUMMY"); break;
        }
    }
    
    spawnCreeps(spawn, creeps);
    
    function spawnCreeps(spawn, creeps) {
        var harvesterCount = _.sum(creeps, (c) => c.memory.role == "harvester");
        if (harvesterCount < roles.harvester.minimum) {
            var name = spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, { role: "harvester", working: false});
            if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
                console.log("Spawned new harvester: " + name);
                return;
            }
        }

        var upgraderCount = _.sum(creeps, (c) => c.memory.role == "upgrader");
        if (upgraderCount < roles.upgrader.minimum) {
            var name = spawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: "upgrader", working: false});
            if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
                console.log("Spawned new upgrader: " + name);
                return;
            }
        }

        var repairerCount = _.sum(creeps, (c) => c.memory.role == "repairer");
        if (repairerCount < roles.repairer.minimum) {
            var name = spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: "repairer", working: false});
            if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
                console.log("Spawned new repairer: " + name);
                return;
            }
        }

        var builderCount = _.sum(creeps, (c) => c.memory.role == "builder");
        if (builderCount < roles.builder.minimum) {
            var name = spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: "builder", working: false});
            if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
                console.log("Spawned new builder: " + name);
                return;
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
