var roleBuilder = require('role.builder');
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
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
            });

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            } else {
                // Repair walls and ramparts after all other structures.
                var walls = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
                });
                
                var weakestWalls = [];
                for (let wall of walls) {
                    if (weakestWalls.length == 0 || wall.hits < weakestWalls[0].hits)
                        weakestWalls = [wall];
                    if (wall.hits == weakestWalls[0].hits)
                        weakestWalls.push(wall);
                }

                if (weakestWalls.length > 0) {
                    var wallIds = _.map(weakestWalls, (w) => w.id);
                    var weakestWall = undefined;
                    if (wallIds.length == 1) {
                        weakestWall = weakestWalls[0];
                    } else {
                        weakestWall = creep.pos.findClosestByPath(weakestWalls);
                        if (weakestWall == undefined)
                            weakestWall = weakestWalls[0];
                    }

                    if (creep.repair(weakestWall) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(weakestWall);
                    }
                } else {
                    roleBuilder.run(creep);
                }
            }
        } else {
            var foundEnergy = harvestEnergy.retrieveFreeEnergy(creep);
            if (!foundEnergy && creep.carry.energy > 0) {
                memory.working = true;
            }
        }
    }
};