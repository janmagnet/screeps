var roleUpgrader = require('role.upgrader');
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
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else {
                roleUpgrader.run(creep);
            }
        } else {
            var foundEnergy = harvestEnergy.retrieveFreeEnergy(creep);
            if (!foundEnergy && creep.carry.energy > 0) {
                memory.working = true;
            }
        }
    }
};