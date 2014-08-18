'use strict';

var Installation = require('./schema.js'),
    moment = require('moment');

var InstallationModel = function (args) {

    var model,
        schema,

        createInstallation = function (installation, user) {

            installation.updatedAt.date = moment();
            installation.updatedAt.user = user;

            new model(installation)
                .save();
        },

        allInstallations = function () {

            model.find(function (err, installations) {
                if (err) {
                    return err;
                }
                return installations;
            });
        },

        getInstallation = function (id) {

            model.findOne({id: id}, function (err, installation) {
                if (err) {
                    return err;
                }
                return installation;
            });
        },

        updateInstallation = function (id, installation) {

            installation.updatedAt.date = moment();
            installation.updatedAt.user = runOptions.options.currentUser;

            model.findOneAndUpdate({id: id}, installation, function (err, installation) {
                if (err) {
                    return err;
                }
            });
        },

        removeInstallation = function (id) {

            model.findOneAndRemove({id: id}, function (err, installation) {
                if (err) {
                    return err;
                }
            });

        };

    function init(connection, collection) {

        if (connection.modelNames().indexOf(collection) >= 0) {
            model = connection.model(collection);
        } else {
            schema = new Installation();
            model = connection.model(collection, schema);
        }
    }

    init(args);

    /* Return model api */
    return {
        create: createInstallation,
        all: allInstallations,
        get: getInstallation,
        update: updateInstallation,
        remove: removeInstallation
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
