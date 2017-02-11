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
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.energy < s.energyCapacity
            });
            
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }

        } else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};