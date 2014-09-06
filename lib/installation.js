'use strict';

var Installation = require('./schema.js'),
    moment = require('moment'),
    _ = require('lodash');

var InstallationModel = function (connection, collection) {

        var model,
            schema,

            createInstallation = function (installation, user, cb) {

                //installation.updatedAt.date = moment();
                //installation.updatedAt.user = user;

                var thisInstallation = new model(installation);

                thisInstallation
                    .save(function (err) {
                        if (err) {
                            cb(err, null);
                        } else {
                            cb(null, thisInstallation);
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

//            installation.updatedAt.date = moment();
//            installation.updatedAt.user = user;

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

                model.findOne({devices: {$elemMatch: {_id: deviceid }}}, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    cb(null, d);
                                }
                            });
                        }
                        else {
                            cb(null, "Couldn't find device: " + deviceid);
                        }
                    }
                })
            },


            updateDevice = function (deviceid, device, cb) {

                model.findOne({'devices._id': deviceid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            model.update({ 'devices._id': deviceid }, { '$set': { 'devices.$': device }}, function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find device: " + deviceid);
                        }
                    }
                });
            },

            newDevice = function (id, device, cb) {

                model.findOne({'_id': id}, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.push(device);
                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            removeDevice = function (deviceid, cb) {

                model.findOne({'devices._id': deviceid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            model.update({_id: installation._id}, { "$pull": { "devices": { "_id": deviceid }}}, function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find device: " + deviceid);
                        }
                    }
                });
            },

            getControl = function (controlid, cb) {

                model.findOne({'devices.controls._id': controlid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                d.controls.forEach(function (c) {
                                    if (c._id == controlid) {
                                        return cb(null, c);
                                    }
                                });
                            });

                        } else {
                            cb(null, "Couldn't find control: " + controlid);
                        }
                    }
                });
            },

            updateControl = function (controlid, control, cb) {

                model.findOne({'devices.controls._id': controlid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                d.controls.forEach(function (c) {
                                    if (c._id == controlid) {
                                        c.set(control);
                                    }
                                });
                            });

                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });

                        } else {
                            cb(null, "Couldn't find control: " + controlid);
                        }
                    }
                });
            },

            newControl = function (id, control, cb) {

                model.findOne({'devices._id': id}, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.forEach(function (d) {
                                if (d._id == id) {
                                    d.controls.push(control);
                                }
                            });

                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find control: " + controlid);
                        }
                    }
                });
            },

            removeControl = function (controlid, cb) {

                model.findOne({'devices.controls._id': controlid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                d.controls.forEach(function (c) {
                                    if (c._id == controlid) {
                                        d.controls.pull(c);
                                    }
                                });
                            });

                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find control: " + controlid);
                        }
                    }
                });
            },

        /* triggers */
            getTrigger = function (triggerid, cb) {

                model.findOne({'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                d.triggers.forEach(function (t) {
                                    if (t._id == triggerid) {
                                        return cb(null, t);
                                    }
                                });
                            });

                        } else {
                            cb(null, "Couldn't find trigger: " + triggerid);
                        }
                    }
                });
            },

            updateTrigger = function (triggerid, trigger, cb) {

                model.findOne({'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                d.triggers.forEach(function (t) {
                                    if (t._id == triggerid) {
                                        t.set(trigger);
                                    }
                                });
                            });

                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });

                        } else {
                            cb(null, "Couldn't find trigger: " + triggerid);
                        }
                    }
                });
            },

            newTrigger = function (id, trigger, cb) {

                model.findOne({'devices._id': id}, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.forEach(function (d) {
                                if (d._id == id) {
                                    d.triggers.push(trigger);
                                }
                            });

                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find trigger: " + triggerid);
                        }
                    }
                });
            },

            removeTrigger = function (triggerid, cb) {

                model.findOne({'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                d.triggers.forEach(function (t) {
                                    if (t._id == triggerid) {
                                        d.triggers.pull(t);
                                    }
                                });
                            });

                            installation.save(function (err, data) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, data);
                                }
                            });
                        } else {
                            cb(null, "Couldn't find trigger: " + triggerid);
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
                                model.update({_id: installation._id}, installationDoc, {upsert: true}, function (err) {
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
            removeInstallation: removeInstallation,
            getDevice: getDevice,
            newDevice: newDevice,
            updateDevice: updateDevice,
            removeDevice: removeDevice,
            getControl: getControl,
            newControl: newControl,
            updateControl: updateControl,
            removeControl: removeControl,
            getTrigger: getTrigger,
            newTrigger: newTrigger,
            updateTrigger: updateTrigger,
            removeTrigger: removeTrigger,
            updateTriggerValue: updateTriggerValue
        };
    }
    ;

module.exports = InstallationModel;
