const {allureCypress} = require("allure-cypress/reporter");

module.exports = {
    e2e: {
        baseUrl: 'http://localhost:8002',
        chromeWebSecurity: false,

        setupNodeEvents(on, config) {
            allureCypress(on, config, {
                resultsDir: "allure-results",
            });

            return config;
        },
    }
};
