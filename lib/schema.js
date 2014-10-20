var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InstallationSchema = new Schema(
    {
        name: String,
        placement: String,
        address: String,
        location: {lat: Number, lng: Number},
        contact: {
            name: String,
            email: String,
            phone: String,
            website: String
        },
        metadata: String,
        devices: [
            {
                name: String,
                placement: String,
                id: String,
                noOfAlarms: Number,
                interval: Number,
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
                        scale: Number,
                        unit: {
                            symbol: String,
                            units: String,
                            precision: Number,
                            name: String
                        },
                        timers: [
                            {
                                name: String,
                                enabled: Boolean,
                                time: String,
                                timestamp: Number,
                                duration: Number,
                                days: []
                            }
                        ]
                    }
                ],
                triggers: [
                    {
                        name: String,
                        enabled: Boolean,
                        notify: Boolean,
                        notifyLevel: String,
                        notifyText: String,
                        requests: [
                            {
                                name: String,
                                request_options: Schema.Types.Mixed
                            }
                        ],
                        trigger_type: { type: String, enum: ['lt', 'lte', 'gt', 'gte', 'eq'] },
                        threshold_value: String,
                        stream_id: String,
                        triggered_value: String,
                        triggered_time: Date,
                        trigger_pause: Number,
                        resolution: { type: String, enum: ['sec', 'min', 'hour', 'day'] },
                        metadata: String
                    }
                ]
            }
        ]
    }
);


module.exports = InstallationSchema;