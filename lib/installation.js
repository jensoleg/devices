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

                model.findOne({_id: id, devices: {$elemMatch: {_id: deviceid }}}, function (err, installation) {
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                })
            },


            updateDevice = function (id, deviceid, device, cb) {

                model.findOne({_id: id, 'devices._id': deviceid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.set(device);
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
                            cb(null, "Couldn't find installation: " + id);
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

            removeDevice = function (id, deviceid, cb) {

                model.findOne({_id: id, 'devices._id': deviceid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    installation.devices.pull(d);
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            getControl = function (id, deviceid, controlid, cb) {

                model.findOne({_id: id, 'devices.controls._id': controlid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            /******** FIND device *******/
                            installation.devices.forEach(function (d) {
                                d.controls.forEach(function (c) {
                                    if (c._id == controlid) {
                                        return cb(null, c);
                                    }
                                });
                            });

                        } else {
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            updateControl = function (id, deviceid, controlid, control, cb) {

                model.findOne({_id: id, 'devices.controls._id': controlid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.controls.forEach(function (c) {
                                        if (c._id == controlid) {
                                            c.set(control);
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            newControl = function (id, deviceid, control, cb) {

                model.findOne({_id: id, 'devices._id': deviceid}, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            removeControl = function (id, deviceid, controlid, cb) {

                model.findOne({'_id': id, 'devices.controls._id': controlid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    var id;
                                    d.controls.forEach(function (c) {
                                        if (c._id == controlid) {
                                            d.controls.pull(c);
                                            id = c.id;
                                        }
                                    });

                                    if (id) {
                                        d.triggers.forEach(function (t) {
                                            if (t.stream_id == id) {
                                                d.triggers.pull(t);
                                            }
                                        });
                                    }
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

        /* triggers */
            getTrigger = function (id, deviceid, triggerid, cb) {

                model.findOne({_id: id, 'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
                                            return cb(null, t);
                                        }
                                    });
                                }
                            });
                        } else {
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            updateTrigger = function (id, deviceid, triggerid, trigger, cb) {

                model.findOne({_id: id, 'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
                                            t.set(trigger);
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
                            cb(null, "Couldn't find installation: " + id);
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
                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            removeTrigger = function (id, deviceid, triggerid, cb) {

                model.findOne({_id: id, 'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {
                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
                                            d.triggers.pull(t);
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
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

        /* requests */

            getRequest = function (id, deviceid, triggerid, requestid, cb) {

                model.findOne({_id: id, 'devices.triggers.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
                                            t.requests.forEach(function (r) {
                                                if (r._id == requestid) {
                                                    return cb(null, r);
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        } else {
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            updateRequest = function (id, deviceid, triggerid, requestid, request, cb) {

                model.findOne({_id: id, 'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
                                            t.requests.forEach(function (r) {
                                                if (r._id == requestid) {
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
                            cb(null, "Couldn't find installation: " + id);
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
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
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
                        }
                        else {
                            cb(null, "Couldn't find installation: " + id);
                        }
                    }
                });
            },

            removeRequest = function (id, deviceid, triggerid, requestid, cb) {

                model.findOne({_id: id, 'devices.triggers._id': triggerid }, function (err, installation) {
                    if (err) {
                        cb(err, null);
                    } else {
                        if (installation) {

                            installation.devices.forEach(function (d) {
                                if (d._id == deviceid) {
                                    d.triggers.forEach(function (t) {
                                        if (t._id == triggerid) {
                                            t.requests.forEach(function (r) {
                                                if (r._id == requestid) {
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
                            cb(null, "Couldn't find installation: " + id);
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
                            cb(null, "Couldn't find installation: " + id);
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
            getRequest: getRequest,
            newRequest: newRequest,
            updateRequest: updateRequest,
            removeRequest: removeRequest,
            updateTriggerValue: updateTriggerValue
        };
    }
    ;

module.exports = InstallationModel;
