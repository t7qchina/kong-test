import {Utils} from "../utils";

export class Route {

    constructor(service) {
        this.hosts = [`host-${Utils.randomString(5)}`];
        this.name = `route-${Date.now()}-${Utils.randomString(4)}`;
        this.tags = [];
        this.service = service;
        this.paths = [`/default/services/${Utils.randomString(6)}/`];
    }
}