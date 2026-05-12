Cypress.Commands.add(
    'tryWait',
    {prevSubject: true},
    (subject, checkFn, options = {}) => {
        const timeout =
            options.timeout ?? Cypress.config('defaultCommandTimeout')

        const interval = 200
        const start = Date.now()

        function retry() {
            return cy.wrap(subject, {log: false}).then(($el) => {
                let passed = false

                try {
                    passed = Boolean(checkFn($el))
                } catch (e) {
                    passed = false
                }
                if (passed) {
                    return true
                }
                if (Date.now() - start >= timeout) {
                    return false
                }
                return cy.wait(interval, {log: false}).then(retry)
            })
        }

        return retry()
    }
)