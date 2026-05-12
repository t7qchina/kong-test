import {GatewayService} from "../services/gateway-service";

export class Administrator {
    createService(workspace, service) {
        const gatewayService = new GatewayService();
        return gatewayService.createService(workspace, service);
    }

    createRoute(workspace, route) {
        const gatewayService = new GatewayService();
        return gatewayService.createRoute(workspace, route);
    }
}