import {Administrator} from "../support/roles/administrator";
import {Service} from "../support/dao/service";
import {Utils} from "../support/utils";
import {ServicePage} from "../support/pages/service-page";
import {NewGatewayServicePage} from "../support/pages/new-gateway-service-page";
import {DEFAULT_WORKSPACE} from "../support/e2e";

describe('Test Create Service Scenarios', () => {

    let service;
    let admin;

    beforeEach(() => {
        service = new Service();
        admin = new Administrator();
    });

    it('Create Service - Positive Scenario', () => {
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Multi-Byte Character Name', () => {
        service.name = `中文Service-${Utils.randomString(4)}`;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ URL contains FQDN', () => {
        service.host = `127.0.0.1.localhost`;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ URL contains Header Injection', () => {
        service.path = `/api/test%0d%0aX-Admin:true`;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                service.path = `/api/test\\r\\nX-Admin:true`;
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Parameterized URL', () => {
        service.path = `/input?q=hello_world`;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ IPv6 Host', () => {
        let newGatewayServicePage = new NewGatewayServicePage(new ServicePage(DEFAULT_WORKSPACE));
        newGatewayServicePage.visit().setFullUrl('http://[2001:4860:4860::8888]:8080/service').setServiceName(service.name);
        cy.get(NewGatewayServicePage.SELECTORS.submit)
            .tryWait(($el) => $el.is(':enabled'))
            .then((enabled) => expect(enabled).to.be.true);
    });

    it('Create Service w/ Empty Service URL', () => {
        let newGatewayServicePage = new NewGatewayServicePage(new ServicePage(DEFAULT_WORKSPACE));
        newGatewayServicePage.visit().setFullUrl('{selectall}{backspace}').setServiceName(service.name);
        cy.get(NewGatewayServicePage.SELECTORS.submit)
            .tryWait(($el) => $el.is(':enabled'))
            .then((enabled) => expect(enabled).to.be.false);
    });

    it('Create Service w/ Special Character Service URL', () => {
        let newGatewayServicePage = new NewGatewayServicePage(new ServicePage(DEFAULT_WORKSPACE));
        newGatewayServicePage.visit().setFullUrl('https://invalid#api.com').setServiceName(service.name);
        cy.get(NewGatewayServicePage.SELECTORS.submit)
            .tryWait(($el) => $el.is(':enabled'))
            .then((enabled) => expect(enabled).to.be.false);
    });

    it('Create Service w/ Empty Service Name', () => {
        service.name = `{selectall}{backspace}`;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                service.name = null;
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Retry Disabled', () => {
        service.retries = 0;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Negative Retry Count', () => {
        service.retries = -1;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (retries: value should be between 0 and 32767)`);
            });
    });

    it('Create Service w/ UDP Protocol', () => {
        service.protocol = 'udp';
        service.path = '';
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.path).to.be.null;

                delete service.path;
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Unsupported Protocol', () => {
        let url = `unknow://${service.host}:${service.port}${service.path}`;
        let newGatewayServicePage = new NewGatewayServicePage(new ServicePage(DEFAULT_WORKSPACE));
        newGatewayServicePage.visit().setFullUrl(url).setServiceName(service.name);
        cy.get(NewGatewayServicePage.SELECTORS.submit)
            .tryWait(($el) => $el.is(':enabled'))
            .then((enabled) => expect(enabled).to.be.false);
    });

    it('Create Service w/ Duplicate Name Scenario', () => {
        admin.createService(DEFAULT_WORKSPACE, service);
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`UNIQUE violation detected on '{name="${service.name}"}'`);
            });
    });

    it('Create Service w/ Negative Connection Timeout', () => {
        service.connect_timeout = -1;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (connect_timeout: value should be between 1 and 2147483646)`);
            });
    });

    it('Create Service w/ Negative Write Timeout', () => {
        service.write_timeout = -1;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (write_timeout: value should be between 1 and 2147483646)`);
            });
    });

    it('Create Service w/ Negative Read Timeout', () => {
        service.read_timeout = -1;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (read_timeout: value should be between 1 and 2147483646)`);
            });
    });

    it('Create Service w/ Zero Connection Timeout', () => {
        service.connect_timeout = 0;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (connect_timeout: value should be between 1 and 2147483646)`);
            });
    });

    it('Create Service w/ Zero Write Timeout', () => {
        service.write_timeout = 0;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (write_timeout: value should be between 1 and 2147483646)`);
            });
    });

    it('Create Service w/ Zero Read Timeout', () => {
        service.read_timeout = 0;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(`schema violation (read_timeout: value should be between 1 and 2147483646)`);
            });
    });

    it('Create Service /w Port Zero', () => {
        service.port = 0;
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Invalid Port', () => {
        let url = `${service.protocol}://${service.host}:${Utils.randomInt(65536, 2147483647)}${service.path}`;
        let newGatewayServicePage = new NewGatewayServicePage(new ServicePage(DEFAULT_WORKSPACE));
        newGatewayServicePage.visit().setFullUrl(url).setServiceName(service.name);
        cy.get(NewGatewayServicePage.SELECTORS.submit)
            .tryWait(($el) => $el.is(':enabled'))
            .then((enabled) => expect(enabled).to.be.false);
    });

    it('Create Service w/ Negative Port', () => {
        let url = `${service.protocol}://${service.host}:-1${service.path}`;
        let newGatewayServicePage = new NewGatewayServicePage(new ServicePage(DEFAULT_WORKSPACE));
        newGatewayServicePage.visit().setFullUrl(url).setServiceName(service.name);
        cy.get(NewGatewayServicePage.SELECTORS.submit)
            .tryWait(($el) => $el.is(':enabled'))
            .then((enabled) => expect(enabled).to.be.false);
    });

    it('Create Service w/ Tags', () => {
        service.tags = Array.from({length: 5}, () => Utils.randomString(4));
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.tags.sort()).to.deep.equal(service.tags.sort());

                delete service.tags;
                expect(result).to.deep.include(service);
            });
    });

    it('Create Service w/ Comma Only Tags', () => {
        service.tags = Array.from({length: 5}, () => ',');
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.tags).to.be.an('array').that.is.empty;

                delete service.tags;
                expect(result).to.deep.include(service);
            });
    });

    it('Create HTTP Service w/ TLS Verify Enabled', () => {
        service.tls_verify = true;
        service.protocol = "http"
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                delete service.tls_verify;

                expect(result.tls_verify).to.be.oneOf([false, null]);
                expect(result).to.deep.include(service);
            });
    });

    it('Create HTTPS Service w/ TLS Verify Enabled', () => {
        service.tls_verify = true;
        service.protocol = "https"
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.tls_verify).to.be.true;
                expect(result).to.deep.include(service);
            });
    });

    it('Create HTTPS Service w/ TLS Verify Disabled', () => {
        service.tls_verify = false;
        service.protocol = "https"
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.tls_verify).to.be.false;
                expect(result).to.deep.include(service);
            });
    });

    it('Create WSS Service w/ TLS Verify Enabled', () => {
        service.tls_verify = true;
        service.protocol = "wss"
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.tls_verify).to.be.true;
                expect(result).to.deep.include(service);
            });
    });

    it('Create WS Service w/ TLS Verify Enabled', () => {
        service.tls_verify = true;
        service.protocol = "ws"
        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.tls_verify).to.be.oneOf([false, null]);

                delete service.tls_verify;
                expect(result).to.deep.include(service);
            });
    });

    it('Create HTTP Service w/ Certificates Configured', () => {
        service.protocol = "http";
        service.client_certificate = crypto.randomUUID();
        service.ca_certificates = [crypto.randomUUID()];

        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(
                    `3 schema violations (failed conditional validation given value of field 'protocol'; ca_certificates: value must be null; client_certificate: value must be null)`
                );
            });
    });

    it('Create HTTPS Service w/ Non-Existent Client Certificate Configured', () => {
        service.protocol = "https";
        service.client_certificate = crypto.randomUUID();

        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.error).to.equal(
                    `the foreign key '{id="${service.client_certificate}"}' does not reference an existing 'certificates' entity.`
                );
            });
    });

    it('Create HTTPS Service w/ Non-Existent CA Certificates Configured', () => {
        service.protocol = "https";
        service.ca_certificates = [crypto.randomUUID()];

        admin.createService(DEFAULT_WORKSPACE, service)
            .then((result) => {
                expect(result.success, "The creation request should be rejected.").to.be.false;
            });
    });
});
