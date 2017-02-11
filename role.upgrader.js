var harvestEnergy = require('harvest.energy');

module.exports = {
    run: function(creep) {
        var memory = creep.memory;

        if (memory.working == true && creep.carry.energy == 0) {
            memory.working = false;
        } else if (memory.working == false && creep.carry.energy == creep.carryCapacity) {
            memory.working = true;
        }

        if (memory.working == true) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            var foundEnergy = harvestEnergy.retrieveFreeEnergy(creep);
            if (!foundEnergy && creep.carry.energy > 0) {
                memory.working = true;
            }
        }        
    }
};