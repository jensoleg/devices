'use strict';

var Installation = require('./schema.js'),
    moment = require('moment');

var InstallationModel = function (connection, collection) {

    var model,
        schema,

        createInstallation = function (installation, user, cb) {

            var thisInstallation = new model(installation);

            //thisInstallation.updatedAt.date = moment();
            //thisInstallation.updatedAt.user = user

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
        removeInstallation: removeInstallation
    };
};

module.exports = InstallationModel;

/* devices api */
/*
 exports.getDevice = function (inst_id) {

 InstallationModel.findOne({id: inst_id}, function (err, installation) {
 if (err) {
 return err;
 }
 if (installation) {
 return installation.devices;
 }

 });

 };

 exports.getDevice = function (inst_id, id) {

 InstallationModel.findOne({id: inst_id}, function (err, installation) {
 if (err) {
 return err;
 }
 if (installation) {
 return installation.devices.filter(function (e) {
 return e._id === id;
 })[0];
 }

 });

 };

 exports.newDevice = function (inst_id, device) {

 InstallationModel.findOne({id: inst_id}, function (err, installation) {
 if (err) {
 return err;
 }
 if (installation) {
 installation.update({$push: { "devices": device}},
 {safe: true, upsert: true},
 function (err) {
 if (err) {
 console.log(err);
 } else {
 console.log("Successfully added" + installation.devices);
 }
 });
 }

 });
 };

 exports.removeDevice = function (inst_id, id) {

 InstallationModel.findOne({id: inst_id}, function (err, installation) {
 if (err) {
 return err;
 }
 if (installation) {
 installation.update({$pull: { "devices":  { _id: id}}},
 function (err, data) {
 if (err) {
 console.log(err);
 } else {
 console.log("Successfully removed" + data);
 }
 });
 }

 });
 };

 exports.updateDevice = function (inst_id, device) {

 InstallationModel.findOne({id: inst_id}, function (err, installation) {
 if (err) {
 return err;
 }
 if (installation) {
 installation.update({'$set': { "devices":  device}},
 function (err, data) {
 if (err) {
 console.log(err);
 } else {
 console.log("Successfully removed" + data);
 }
 });
 }

 });
 };
 */
/* controls api */


/* trigger api */


/*requests api */
