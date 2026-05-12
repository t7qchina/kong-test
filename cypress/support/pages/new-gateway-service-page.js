export class NewGatewayServicePage {

    static SELECTORS = {
        fullUrl: '[data-testid="gateway-service-url-input"]',
        retries: '[data-testid="gateway-service-retries-input"]',
        connectionTimeout: '[data-testid="gateway-service-connTimeout-input"]',
        writeTimeout: '[data-testid="gateway-service-writeTimeout-input"]',
        readTimeout: '[data-testid="gateway-service-readTimeout-input"]',
        clientCertificate: '[data-testid="gateway-service-clientCert-input"]',
        caCertificates: '[data-testid="gateway-service-ca-certs-input"]',
        serviceName: '[data-testid="gateway-service-name-input"]',
        collapseTrigger: '[data-testid="collapse-trigger-content"]',
        tlsVerify: '[data-testid="gateway-service-tls-verify-checkbox"]',
        enableTls: '[data-testid="gateway-service-tls-verify-true-option"]',
        disableTls: '[data-testid="gateway-service-tls-verify-false-option"]',
        submit: '[data-testid="service-create-form-submit"]',
        tags: '[data-testid="gateway-service-tags-input"]',
    };

    servicePage;

    constructor(servicePage) {
        this.servicePage = servicePage;
    }

    visit() {
        this.servicePage.visit();
        this.servicePage.createGatewayService();
        return this;
    }

    setFullUrl(fullUrl) {
        if (fullUrl != null && fullUrl !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.fullUrl).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.fullUrl).type(fullUrl);
        }
        return this;
    }

    setRetries(retries) {
        if (retries != null && retries !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.retries).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.retries).type(retries);
        }
        return this;
    }

    setConnectionTimeout(timeout) {
        if (timeout != null && timeout !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.connectionTimeout).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.connectionTimeout).type(timeout);
        }
        return this;
    }

    setWriteTimeout(timeout) {
        if (timeout != null && timeout !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.writeTimeout).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.writeTimeout).type(timeout);
        }
        return this;
    }

    setReadTimeout(timeout) {
        if (timeout != null && timeout !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.readTimeout).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.readTimeout).type(timeout);
        }
        return this;
    }

    setClientCertificate(certificate) {
        if (certificate != null && certificate !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.clientCertificate).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.clientCertificate).type(certificate);
        }
        return this;
    }

    setCaCertificate(certificates) {
        if (certificates != null) {
            let input = certificates.join(',');
            if (input !== "") {
                cy.get(NewGatewayServicePage.SELECTORS.caCertificates).type('{selectall}');
                cy.get(NewGatewayServicePage.SELECTORS.caCertificates).type(input);
            }
        }
        return this;
    }

    setServiceName(name) {
        if (name != null && name !== "") {
            cy.get(NewGatewayServicePage.SELECTORS.serviceName).type('{selectall}');
            cy.get(NewGatewayServicePage.SELECTORS.serviceName).type(name);
        }
        return this;
    }

    setTags(tags) {
        if (tags != null) {
            let input = tags.join(',');
            if (input !== "") {
                cy.get(NewGatewayServicePage.SELECTORS.tags).type('{selectall}');
                cy.get(NewGatewayServicePage.SELECTORS.tags).type(input);
            }
        }
        return this;
    }

    enableTlsVerify(enable) {
        if (enable != null) {
            cy.get(NewGatewayServicePage.SELECTORS.tlsVerify).check();
            if (enable) {
                cy.get(NewGatewayServicePage.SELECTORS.enableTls).click();
            } else {
                cy.get(NewGatewayServicePage.SELECTORS.disableTls).click();
            }
        }
        return this;
    }

    expandAdvancedFields() {
        cy.contains(
            NewGatewayServicePage.SELECTORS.collapseTrigger,
            'View advanced fields'
        ).click();
        return this;
    }

    expandTags() {
        cy.contains(
            NewGatewayServicePage.SELECTORS.collapseTrigger,
            'Add tags'
        ).click();
        return this;
    }

    submit() {
        cy.intercept('POST', '**/services').as('createService');

        cy.get(NewGatewayServicePage.SELECTORS.submit).click();

        return cy.wait('@createService')
            .then(({response}) => {
                if (response.statusCode === 201) {
                    return {success: true, body: response.body};
                } else {
                    return {success: false, error: response.body.message};
                }
            });
    }
}