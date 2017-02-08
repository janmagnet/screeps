var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

var roles = {
    harvester: {
        minimum: 6
    },
    upgrader: {
        minimum: 8
    }
};

module.exports.loop = function() {
    clearMemory();

    var spawn = Game.spawns.Alpha;

    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch (creep.memory.role) {
            case "harvester": roleHarvester.run(creep, spawn); break;
            case "upgrader": roleUpgrader.run(creep); break;
            default: creep.say("DUMMY"); break;
        }
    }

    
    var harvesterCount = _.sum(Game.creeps, (c) => c.memory.role == "harvester");

    if (harvesterCount < roles.harvester.minimum) {
        var name = spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, { role: "harvester", working: false});
        if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
            console.log("Spawned new harvester: " + name);
        }
    }

    var upgraderCount = _.sum(Game.creeps, (c) => c.memory.role == "upgrader");

    if (upgraderCount < roles.upgrader.minimum) {
        var name = spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, { role: "upgrader", working: false});
        if (name != ERR_BUSY && name != ERR_NOT_ENOUGH_ENERGY) {
            console.log("Spawned new upgrader: " + name);
        }
    }

    function clearMemory() {
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
    }
}
