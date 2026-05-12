import {Service} from "../support/dao/service";
import {Administrator} from "../support/roles/administrator";
import {Route} from "../support/dao/route";
import {DEFAULT_WORKSPACE} from "../support/e2e";
import {Utils} from "../support/utils";

describe('Test Create Route Scenarios', () => {

    let service;
    let route;
    let admin;

    beforeEach(() => {
        service = new Service();
        admin = new Administrator();
        admin.createService(DEFAULT_WORKSPACE, service).then((result) => route = new Route(result));
    });

    it('Create Route - Positive Scenario', () => {
        admin.createRoute(DEFAULT_WORKSPACE, route)
            .then((result) => {
                expect(result.service.id).to.be.equals(route.service.id);

                delete route.service;
                expect(result).to.deep.include(route);
            });
    });

    it('Create Route w/ Tags', () => {
        route.tags = Array.from({length: 5}, () => Utils.randomString(4));
        admin.createRoute(DEFAULT_WORKSPACE, route)
            .then((result) => {
                expect(result.tags.sort()).to.deep.equal(route.tags.sort());

                delete route.service;
                delete route.tags;
                expect(result).to.deep.include(route);
            });
    });
})