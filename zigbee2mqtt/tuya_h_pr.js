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
    key: [...tuya.tz.datapoints.key, 'radar_sensitivity', 'entry_sensitivity', 'illumin_threshold', 'detection_range','shield_range','entry_distance_indentation','entry_filter_time','departure_delay','block_time', 'breaker_polarity', 'status_indication','breaker_mode']
}

const definition = {
    fingerprint: [{ modelID: 'TS0601', manufacturerName: '_TZE204_sbyx0lm6' }],
    model: 'MTG075-ZB-RL',
    vendor: 'TuYa',
    description: '5.8G Human presence sensor with relay',
    configure: tuya.configureMagicPacket,
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tzDatapoints],
    exposes: [
        e.presence(), e.illuminance_lux(),
        e.numeric('target_distance', ea.STATE).withDescription('Distance to target').withUnit('m'),
        e.numeric('radar_sensitivity', ea.STATE_SET).withValueMin(0).withValueMax(9).withValueStep(1).withDescription('sensitivity of the radar'),
        e.numeric('entry_sensitivity', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(1).withDescription('Entry sensitivity'),
        e.numeric('illumin_threshold', ea.STATE_SET).withValueMin(0).withValueMax(420).withValueStep(0.1).withUnit('lx').withDescription('Illumination threshold for switching on'),
        e.numeric('detection_range', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(0.1).withUnit('m').withDescription('Detection range'),
        e.numeric('shield_range', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(0.1).withUnit('m').withDescription('Shield range of the radar'),
		e.numeric('entry_distance_indentation', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(0.1).withUnit('m').withDescription('Entry distance indentation'),
		e.numeric('entry_filter_time', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(0.1).withUnit('sec').withDescription('Entry filter time'),
		e.numeric('departure_delay', ea.STATE_SET).withValueMin(0).withValueMax(100).withValueStep(1).withUnit('sec').withDescription('Turn off delay'),
		e.numeric('block_time', ea.STATE_SET).withValueMin(0).withValueMax(10).withValueStep(0.1).withUnit('sec').withDescription('Block time'),
		e.enum('breaker_mode', ea.STATE_SET, ['standard', 'local', 'not support']).withDescription('Status Breaker mode'),
		e.binary('breaker_status', ea.STATE).withDescription('Breaker status'),
		e.enum('status_indication', ea.STATE_SET, ['OFF', 'ON']).withDescription('Status indication'),
		e.enum('breaker_polarity', ea.STATE_SET, ['NC', 'NO']).withDescription('Breaker polarity'),
    ],
	meta: {
		tuyaDatapoints: [
			[1, 'presence', tuya.valueConverter.trueFalse1],
			[2, 'radar_sensitivity', tuya.valueConverter.raw],
			[3, 'shield_range', tuya.valueConverter.divideBy100],
			[4, 'detection_range', tuya.valueConverter.divideBy100],
			[6, 'equipment_status', tuya.valueConverter.raw], 
			[9, 'target_distance', tuya.valueConverter.divideBy100],
			[101, 'entry_filter_time', tuya.valueConverter.divideBy10],
			[102, 'departure_delay', tuya.valueConverter.raw],
			[103, 'cline', tuya.valueConverter.raw],
			[104, 'illuminance_lux', tuya.valueConverter.divideBy10],
			[105, 'entry_sensitivity', tuya.valueConverter.raw],
			[106, 'entry_distance_indentation', tuya.valueConverter.divideBy100],
			[107, 'breaker_mode', tuya.valueConverterBasic.lookup({'standard': tuya.enum(0), 'local': tuya.enum(1),'not support': tuya.enum(2)})],
			[108, 'breaker_status', tuya.valueConverter.trueFalse1],   //tuya.valueConverter.onOff
			[109, 'status_indication', tuya.valueConverterBasic.lookup({'OFF': tuya.enum(0), 'ON': tuya.enum(1)})],
			[110, 'illumin_threshold', tuya.valueConverter.divideBy10],
			[111, 'breaker_polarity', tuya.valueConverterBasic.lookup({'NC': tuya.enum(0), 'NO': tuya.enum(1)})],
			[112, 'block_time', tuya.valueConverter.divideBy10],
			[113, 'parameter_setting_result', tuya.valueConverter.raw],
			[114, 'factory_parameters', tuya.valueConverter.raw],
			//[115, 'sensor', tuya.valueConverter.trueFalse1],
            ],
        },
    icon: 'data:image/png;base64,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',
};

module.exports = definition;