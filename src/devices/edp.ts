import * as fz from "../converters/fromZigbee";
import * as tz from "../converters/toZigbee";
import * as exposes from "../lib/exposes";
import * as m from "../lib/modernExtend";
import * as reporting from "../lib/reporting";
import type {DefinitionWithExtend} from "../lib/types";

const e = exposes.presets;

export const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ["ZB-SmartPlug-1.0.0", "ZB-SmartPlugIR-1.0.0"],
        model: "PLUG EDP RE:DY",
        vendor: "EDP",
        description: "re:dy plug",
        fromZigbee: [fz.on_off, fz.metering],
        toZigbee: [tz.on_off],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(85);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "seMetering"]);
            // await reporting.readMeteringMultiplierDivisor(endpoint);
            // Fix for UNSUPPORTED_ATTRIBUTE
            endpoint.saveClusterAttributeKeyValue("seMetering", {divisor: 1000, multiplier: 1});
            await reporting.onOff(endpoint);
            await reporting.instantaneousDemand(endpoint);
        },
        exposes: [e.switch(), e.power(), e.energy()],
    },
    {
        zigbeeModel: ["ZB-RelayControl-1.0.0"],
        model: "SWITCH EDP RE:DY",
        vendor: "EDP",
        description: "re:dy switch",
        extend: [m.onOff()],
    },
];
