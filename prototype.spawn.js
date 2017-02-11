module.exports = function() {

    var BODYPART_COST = {
        WORK: 10,
        MOVE: 5,
        CARRY: 5,
        ATTACK: 8,
        HEAL: 25,
        RANGED_ATTACK: 15,
        TOUGH: 1,
        CLAIM: 60
    };

    StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
        var partsSequence = [MOVE, WORK, CARRY];
        var body = makeBody(energy, partsSequence);

        return this.createCreep(body, undefined, { role: roleName, working: false});
    };

    var makeBody = function(energy, partsSequence) {
        var partCount = Math.min(50, Math.floor(energy / 10.0));
        var partsSequenceLength = partsSequence.length;
        var body = [];

        for (let i = 0; i < partCount; i++) {
            var partIndex = i % partsSequenceLength;
            var part = partsSequence[partIndex];
            body.push(part);
        }

        return body;
    };
};