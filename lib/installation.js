'use strict';

var Installation = require('./schema.js'),
    moment = require('moment'),
    _ = require('lodash');

var InstallationModel = function (connection, collection) {

    var model,
        schema,

        createInstallation = function (installation, user, cb) {

            installation.updatedAt.date = moment();
            installation.updatedAt.user = user;

            var thisInstallation = new model(installation);

            thisInstallation
                .save(function (err) {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, installation);
                    }
                });
        },

        allInstallations = function (cb) {

            model.find(function (err, installations) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, installations);
                }
            });
        },

        getInstallation = function (id, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, installation);
                }
            });
        },


        updateInstallation = function (id, user, installation, cb) {

            installation.updatedAt.date = moment();
            installation.updatedAt.user = user;

            model.findOneAndUpdate({_id: id}, installation, function (err, installation) {
                if (err) {
                    cb(err);
                } else {
                    cb(null);
                }
            });
        },

        removeInstallation = function (id, cb) {

            model.findOneAndRemove({_id: id}, function (err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null);
                }

            });

        },
        getDevice = function (deviceid, cb) {

            model.findOne({devices: {$elemMatch: {id: deviceid }}}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {
                        var device = _.filter(installation.devices, { 'id': deviceid })
                        cb(null, device[0]._doc);
                    } else {
                        cb(null, "Couldn't find device: " + deviceid);
                    }
                }
            });
        },

        updateTriggerValue = function (deviceid, triggerIndex, value, cb) {

            model.findOne({devices: {$elemMatch: {id: deviceid }}}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {
                        var index = _.findIndex(installation.devices, { 'id': deviceid })
                        if (_.isNumber(index)) {
                            var installationDoc = installation.toObject();
                            installationDoc.devices[index].triggers[triggerIndex].triggered_value = value;
                            model.update({_id: installation._id}, installationDoc, {upsert: true},function (err) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, null);
                                }
                            });
                        }
                    } else {
                        cb(null, "Couldn't find device: " + deviceid);
                    }
                }
            });
        };

    function init(connection, collection) {

        if (connection.modelNames().indexOf(collection) >= 0) {
            model = connection.model(collection);
        } else {
            schema = Installation;
            connection.model(collection, schema);
            model = connection.model(collection);
        }
    }

    init(connection, collection);

    /* Return model api */
    return {
        createInstallation: createInstallation,
        allInstallations: allInstallations,
        getInstallation: getInstallation,
        updateInstallation: updateInstallation,
        getDevice: getDevice,
        updateTriggerValue: updateTriggerValue
    };
};

module.exports = InstallationModel;
