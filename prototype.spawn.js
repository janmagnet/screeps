module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
        var partCount = Math.floor(energy / 10.0);

        var body = [];
        var counter = 0;

        body.push(MOVE);
        counter++;

        if (counter < partCount) {
            while (true) {
                body.push(WORK);
                counter++;
                if (counter >= partCount || counter >= 50) break;

                body.push(CARRY);
                counter++;
                if (counter >= partCount || counter >= 50) break;

                body.push(MOVE);
                counter++;
                if (counter >= partCount || counter >= 50) break;
            }

        }

        return this.createCreep(body, undefined, { role: roleName, working: false});
    }
};