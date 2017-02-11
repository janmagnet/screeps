module.exports = {
    retrieveFreeEnergy: function(creep) {
        var canPickupDroppedEnergy = module.exports.pickupDroppedEnergy(creep);
        if (canPickupDroppedEnergy) return true;

        var canRetrieveStoredEnergy = module.exports.retrieveStoredEnergy(creep);
        if (canRetrieveStoredEnergy) return true;

        var canHarvest = module.exports.harvestEnergy(creep);
        if (canHarvest) return true;

        console.log(creep.name + " cannot find free energy.")
        return false;
    },

    harvestEnergy: function(creep) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source == undefined) return false;

        var result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }

        return true;
    },

    pickupDroppedEnergy: function(creep) {
        var source = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
        if (source == undefined) return false;

        if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }

        return true;
    },

    retrieveStoredEnergy: function(creep) {
        var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0
        });
        if (source == undefined) return false;
        
        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }

        return true;
    }
};