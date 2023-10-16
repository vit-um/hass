const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const utils = require('zigbee-herdsman-converters/lib/utils');
const globalStore = require('zigbee-herdsman-converters/lib/store');
const legacy = require('zigbee-herdsman-converters/lib/legacy');
const e = exposes.presets;
const ea = exposes.access;

const tzDatapoints = {
    ...tuya.tz.datapoints,
    key: [...tuya.tz.datapoints.key, 'radar_sensitivity', 'entry_sensitivity', 'illumin_threshold', 'detection_range','shield_range','entry_distance_indentation','entry_filter_time','departure_delay','block_time', 'status_indication','breaker_mode','breaker_status']
}

const definition = {
    fingerprint: [{ modelID: 'TS0207', manufacturerName: '_TZ3000_nlsszmzl'}],
    model: 'TS0207_repeater',
    vendor: 'TuYa',
    description: 'Repeater',
    configure: tuya.configureMagicPacket,
	fromZigbee: [fz.linkquality_from_basic],
    toZigbee: [],
    exposes: [],
};

module.exports = definition;