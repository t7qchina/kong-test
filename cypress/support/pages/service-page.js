export class ServicePage {

    static SELECTORS = {
        newService: '[data-testid="toolbar-add-gateway-service"], [data-testid="empty-state-action"]'
    }

    constructor(workspace) {
        this.workspace = workspace;
    }

    visit() {
        cy.visit(`/${this.workspace}/services`)
        return this;
    }

    createGatewayService() {
        cy.get(ServicePage.SELECTORS.newService).click();
    }
}
