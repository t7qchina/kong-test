import {Utils} from "../utils";

export class Service {
    constructor() {
        this.connect_timeout = Utils.randomInt(1000, 120000);
        this.protocol = Math.random() < 0.5 ? 'http' : 'https';
        this.host = `host-${Utils.randomString(5)}`;
        this.name = `service-${Date.now()}-${Utils.randomString(4)}`;
        this.read_timeout = Utils.randomInt(1000, 120000);
        this.port = Utils.randomInt(1024, 65535);
        this.tags = null;
        this.tls_verify = null;
        this.tls_sans = null;
        this.enabled = true;
        this.tls_verify_depth = null;
        this.ca_certificates = null;
        this.retries = Utils.randomInt(0, 10);
        this.client_certificate = null;
        this.path = `/default/services/${Utils.randomString(6)}/`;
        this.write_timeout = Utils.randomInt(1000, 120000);
    }
}