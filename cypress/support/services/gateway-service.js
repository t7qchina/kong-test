import {ServicePage} from "../pages/service-page";
import {NewGatewayServicePage} from "../pages/new-gateway-service-page";
import {RoutePage} from "../pages/route-page";
import {NewRoutePage} from "../pages/new-route-page";

export class GatewayService {

    createService(workspace, service) {
        const servicePage = new ServicePage(workspace);
        const newGatewayServicePage = new NewGatewayServicePage(servicePage);

        const url = `${service.protocol}://${service.host}:${service.port}${service.path}`;

        return newGatewayServicePage.visit()
            .expandAdvancedFields()
            .expandTags()
            .setFullUrl(url)
            .setRetries(service.retries)
            .setConnectionTimeout(service.connect_timeout)
            .setWriteTimeout(service.write_timeout)
            .setReadTimeout(service.read_timeout)
            .setClientCertificate(service.client_certificate)
            .setCaCertificate(service.ca_certificates)
            .enableTlsVerify(service.tls_verify)
            .setServiceName(service.name)
            .setTags(service.tags)
            .submit()
            .then((result) => {
                if (result.success) {
                    return result.body;
                } else {
                    return result;
                }
            });
    }

    createRoute(workspace, route) {
        const routePage = new RoutePage(workspace);
        const newRoutePage = new NewRoutePage(routePage);

        return newRoutePage.visit()
            .setName(route.name)
            .setService(route.service)
            .setTags(route.tags)
            .setPath(route.paths)
            .setHost(route.hosts)
            .submit()
            .then((result) => {
                if (result.success) {
                    return result.body;
                } else {
                    return result;
                }
            });
    }
}