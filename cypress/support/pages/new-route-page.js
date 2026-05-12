export class NewRoutePage {

    static SELECTORS = {
        name: '[data-testid="route-form-name"]',
        service: '[data-testid="route-form-service-id"]',
        routeTags: '[data-testid="route-form-tags"]',
        path: '[data-testid="route-form-paths-input-1"]',
        methods: '[data-testid="multiselect-trigger"]',
        host: '[data-testid="route-form-hosts-input-1"]',
        tags: '[data-testid="route-form-tags"]',
        submit: '[data-testid="route-create-form-submit"]'
    }

    routePage;

    constructor(routePage) {
        this.routePage = routePage;
    }

    visit() {
        this.routePage.visit();
        this.routePage.createRoute();
        return this;
    }

    setName(name) {
        if (name != null && name !== "") {
            cy.get(NewRoutePage.SELECTORS.name).type('{selectall}');
            cy.get(NewRoutePage.SELECTORS.name).type(name);
        }
        return this;
    }

    setService(service) {
        if (service != null && service.name != null) {
            cy.get(NewRoutePage.SELECTORS.service).click();

            cy.get('.select-items-container')
                .contains('.select-item-label', service.name)
                .click();
        }
        return this;
    }

    setTags(tags) {
        if (tags != null) {
            let input = tags.join(',');
            if (input !== "") {
                cy.get(NewRoutePage.SELECTORS.tags).type('{selectall}');
                cy.get(NewRoutePage.SELECTORS.tags).type(input);
            }
        }
        return this;
    }

    setPath(paths) {
        if (paths != null && paths.length > 0) {
            cy.get(NewRoutePage.SELECTORS.path).type('{selectall}');
            cy.get(NewRoutePage.SELECTORS.path).type(paths[0]);
        }
        return this;
    }

    setHost(hosts) {
        if (hosts != null && hosts.length > 0) {
            cy.get(NewRoutePage.SELECTORS.host).type('{selectall}');
            cy.get(NewRoutePage.SELECTORS.host).type(hosts[0]);
        }
        return this;
    }

    submit() {
        cy.intercept('POST', '**/routes').as('createRoute');

        cy.get(NewRoutePage.SELECTORS.submit).click();

        return cy.wait('@createRoute')
            .then(({response}) => {
                if (response.statusCode === 201) {
                    return {success: true, body: response.body};
                } else {
                    return {success: false, error: response.body.message};
                }
            });
    }
}