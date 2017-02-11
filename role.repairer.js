var roleBuilder = require('role.builder');
var harvestEnergy = require('harvest.energy');

module.exports = {
    run: function(creep) {
        var memory = creep.memory;
        var isWorking = memory.working;
        
        if (isWorking == true && creep.carry.energy == 0) {
            memory.working = false;
        } else if (isWorking == false && creep.carry.energy == creep.carryCapacity) {
            memory.working = true;
        }

        if (isWorking == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
            });

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            } else {
                roleBuilder.run(creep);
            }
        } else {
            var foundEnergy = harvestEnergy.retrieveFreeEnergy(creep);
            if (!foundEnergy && creep.carry.energy > 0) {
                memory.working = true;
            }
        }
    }
};