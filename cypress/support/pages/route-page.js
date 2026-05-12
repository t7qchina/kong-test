export class RoutePage {

    static SELECTORS = {
        newRoute: '[data-testid="toolbar-add-route"], [data-testid="empty-state-action"]'
    }

    constructor(workspace) {
        this.workspace = workspace;
    }

    visit() {
        cy.visit(`/${this.workspace}/routes`)
        return this;
    }

    createRoute() {
        cy.get(RoutePage.SELECTORS.newRoute).click();
    }
}