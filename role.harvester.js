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
            var canTransferEnergyToSpawnAndExtensions = module.exports.transferEnergyToSpawnAndExtensions(creep);
            if (canTransferEnergyToSpawnAndExtensions) return;

            var canTransferEnergyToTower = module.exports.transferEnergyToTower(creep);
            if (canTransferEnergyToTower) return;

            var canTransferEnergyToStorageAndContainer = module.exports.transferEnergyToStorageAndContainer(creep);
            if (canTransferEnergyToStorageAndContainer) return;

            roleUpgrader.run(creep);
        } else {
            var foundEnergy = harvestEnergy.harvestEnergy(creep);
            if (!foundEnergy && creep.carry.energy > 0) {
                memory.working = true;
            }
        }
    },

    transferEnergyToSpawnAndExtensions: function(creep) {
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity
        });
        
        if (structure == undefined) return false;

        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
        }
        
        return true;
    },

    transferEnergyToTower: function(creep) {
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
        });
        
        if (structure == undefined) return false;

        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
        }
        
        return true;
    },

    transferEnergyToStorageAndContainer: function(creep) {
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.storeCapacity - _.sum(s.store) > 0
        });
        
        if (structure == undefined) return false;

        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
        }
        
        return true;
    }
};