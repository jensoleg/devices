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

        getDevice = function (id, deviceid, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        var device = installation.devices.id(deviceid);

                        if (device) {
                            cb(null, device);
                        } else {
                            cb(null, "Couldn't find device: " + deviceid);
                        }
                    } else {
                        cb(null, "Couldn't find device: " + id);
                    }
                }
            });
        },


        updateDevice = function (id, deviceid, device, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.id(deviceid).set(device);

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });

                    } else {
                        cb(null, "Couldn't find device: " + id);
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
                        cb(null, "Couldn't find device: " + id);
                    }
                }
            });
        },

        removeDevice = function (id, deviceid, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.id(deviceid).remove();

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });

                    } else {
                        cb(null, "Couldn't find control: " + id);
                    }
                }
            });
        },

        getControl = function (id, deviceid, controlid, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        var control = installation.devices.id(deviceid).controls.id(controlid);

                        if (control) {
                            return cb(null, control);
                        }

                        cb(null, "Couldn't find control: " + controlid);

                    } else {
                        cb(null, "Couldn't find control: " + id);
                    }
                }
            });
        },

        updateControl = function (id, deviceid, controlid, control, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {


                        installation.devices.id(deviceid).controls.id(controlid).set(control);

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });

                    } else {
                        cb(null, "Couldn't find controle: " + id);
                    }
                }
            });
        },

        newControl = function (id, deviceid, control, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.id(deviceid).controls.push(control);

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });
                    } else {
                        cb(null, "Couldn't find control: " + id);
                    }
                }
            });
        },

        removeControl = function (id, deviceid, controlid, cb) {

            model.findOne({'_id': id, 'devices.controls._id': controlid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        /*
                         installation.devices.forEach(function (d) {
                         if (d._id === deviceid) {
                         var cid;
                         d.controls.forEach(function (c) {
                         if (c._id === controlid) {
                         d._doc.controls.pull(c);
                         cid = c.id;
                         }
                         });

                         if (cid) {
                         d.triggers.forEach(function (t) {
                         if (t.stream_id === id) {
                         d._doc.triggers.pull(t);
                         }
                         });
                         }
                         }
                         });
                         */
                        installation.devices.id(deviceid).controls.id(controlid).remove();

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });
                    } else {
                        cb(null, "Couldn't find control: " + id);
                    }
                }
            });
        },

    /* triggers */
        getTrigger = function (id, deviceid, triggerid, cb) {

            model.findOne({_id: id, 'devices.triggers._id': triggerid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {
                        var trigger = installation.devices.id(deviceid).triggers.id(triggerid);
                        return cb(null, trigger);
                    }
                    return cb(null, "Couldn't find trigger: " + id);
                }
            });
        },

        updateTrigger = function (id, deviceid, triggerid, trigger, cb) {

            model.findOne({_id: id}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.id(deviceid).triggers.id(triggerid).set(trigger);

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });

                    } else {
                        cb(null, "Couldn't find trigger: " + id);
                    }
                }
            });
        },

        newTrigger = function (id, deviceid, trigger, cb) {

            model.findOne({_id: id, 'devices._id': deviceid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        var device = installation.devices.id(deviceid)

                        if (device) {
                            device.triggers.push(trigger);
                        }

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });
                    } else {
                        cb(null, "Couldn't find trigger: " + id);
                    }
                }
            });
        },

        removeTrigger = function (id, deviceid, triggerid, cb) {

            model.findOne({_id: id, 'devices.triggers._id': triggerid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        var trigger = installation.devices.id(deviceid).triggers.id(triggerid);

                        if (trigger) {
                            installation.devices.id(deviceid).triggers.pull(trigger)
                        }

                        installation.save(function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, data);
                            }
                        });
                    } else {
                        cb(null, "Couldn't find trigger: " + id);
                    }
                }
            });
        },

    /* requests */

        getRequest = function (id, deviceid, triggerid, requestid, cb) {

            model.findOne({_id: id, 'devices.triggers.triggers._id': triggerid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.forEach(function (d) {
                            if (d._id === deviceid) {
                                d.triggers.forEach(function (t) {
                                    if (t._id === triggerid) {
                                        t.requests.forEach(function (r) {
                                            if (r._id === requestid) {
                                                return cb(null, r);
                                            }
                                        });
                                    }
                                });
                            }
                        });

                    } else {
                        cb(null, "Couldn't find request: " + id);
                    }
                }
            });
        },

        updateRequest = function (id, deviceid, triggerid, requestid, request, cb) {

            model.findOne({_id: id, 'devices.triggers._id': triggerid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.forEach(function (d) {
                            if (d._id === deviceid) {
                                d.triggers.forEach(function (t) {
                                    if (t._id === triggerid) {
                                        t.requests.forEach(function (r) {
                                            if (r._id === requestid) {
                                                r.set(request);
                                            }
                                        });
                                    }
                                });
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
                        cb(null, "Couldn't find request: " + id);
                    }
                }
            });
        },

        newRequest = function (id, deviceid, triggerid, request, cb) {

            model.findOne({_id: id, 'devices._id': deviceid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.forEach(function (d) {
                            if (d._id === deviceid) {
                                d.triggers.forEach(function (t) {
                                    if (t._id === triggerid) {
                                        t.requests.push(request);
                                    }
                                });
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
                        cb(null, "Couldn't find request: " + id);
                    }
                }
            });
        },

        removeRequest = function (id, deviceid, triggerid, requestid, cb) {

            model.findOne({_id: id, 'devices.triggers._id': triggerid}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {

                        installation.devices.forEach(function (d) {
                            if (d._id === deviceid) {
                                d.triggers.forEach(function (t) {
                                    if (t._id === triggerid) {
                                        t.requests.forEach(function (r) {
                                            if (r._id === requestid) {
                                                t.requests.pull(r);
                                            }
                                        });
                                    }
                                });
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
                        cb(null, "Couldn't find request: " + id);
                    }
                }
            });
        },

        updateTriggerValue = function (deviceid, triggerIndex, value, cb) {

            model.findOne({devices: {$elemMatch: {id: deviceid}}}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {
                        var index = _.findIndex(installation.devices, {'id': deviceid});
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
        },

        findDevice = function (deviceid, cb) {

            model.findOne({devices: {$elemMatch: {id: deviceid}}}, function (err, installation) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installation) {
                        var index = _.findIndex(installation.devices, {'id': deviceid});
                        if (_.isNumber(index)) {
                            var installationDoc = installation.toObject();
                            cb(null, {'installation': installation, 'device': installationDoc.devices[index]});
                        }
                    } else {
                        cb(null, "Couldn't find device: " + deviceid);
                    }
                }
            });
        },

        allTriggers = function (cb) {

            var all = [];
            model.find({'devices.triggers.name': {$exists: true}}, function (err, installations) {
                if (err) {
                    cb(err, null);
                } else {
                    if (installations) {
                        installations.forEach(function (i) {
                            i.devices.forEach(function (d) {
                                d.triggers.forEach(function (t) {
                                    if (!_.some(all, {
                                            'installation': i.name,
                                            'installationId': i.id,
                                            'deviceId': d.id,
                                            'controlId': t.stream_id
                                        })) {
                                        all.push({
                                            'installation': i.name,
                                            'installationId': i.id,
                                            'deviceId': d.id,
                                            'controlId': t.stream_id
                                        });
                                    }
                                });
                            });
                        });
                    }
                }
                cb(null, all);
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
        getRequest: getRequest,
        newRequest: newRequest,
        updateRequest: updateRequest,
        removeRequest: removeRequest,
        updateTriggerValue: updateTriggerValue,
        allTrigger: allTriggers,
        findDevice: findDevice

    };
};

module.exports = InstallationModel;
