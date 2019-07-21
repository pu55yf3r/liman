const util = require("../util/util");

class Volume {
    constructor(name, driver) {
        this.name = name;
        this.driver = driver;
    }

    async ls() {
        try {
            command = "docker volume ls --format '{{.Name}}\t{{.Driver}}'";
            let lines = await util.execCommand(command);

            let volumes = [];
            lines.forEach((items) => {
                let item = items.split("\t");
                volumes.push(new Volume(item[0], item[1]));
            });

            return volumes;
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = Volume;