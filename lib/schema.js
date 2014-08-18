var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema(
    {
        name: String,
        placement: String,
        id: String,
        updatedAt: {
            date: {type: Date},
            user: {type: String}
        },
        metadata: String,
        controls: [
            {
                id: String,
                name: String,
                metadata: String,
                ctrlType: String,
                minValue: Number,
                maxValue: Number,
                minCritical: Number,
                maxCritical: Number,
                unit: {
                    symbol: String,
                    units: String,
                    precision: Number,
                    conversion_exp: String
                }
            }
        ],
        triggers: [
            {
                request: [
                    {request_options: Schema.Types.Mixed}
                ],
                trigger_type: { type: String, enum: ['lt', 'lte', 'gt', 'gte', 'eq'] },
                threshold_value: String,
                stream_id: String,
                triggered_value: String,
                resolution: { type: String, enum: ['sec', 'min', 'hour', 'day'] },
                metadata: String
            }
        ]
    }
);


var InstallationSchema = new Schema(
    {
        name: String,
        placement: String,
        location: {lat: Number, lng: Number},
        metadata: String,
        devices: [ DeviceSchema ]
    }
);


module.exports = InstallationSchema;