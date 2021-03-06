var util = require('util');
var VoiceBroadcast = require('mongoose').model('VoiceBroadcast');

var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                return err.errors[errName].message;
        }
    } else {
        return "发生未知错误";
    }
};

exports.create = function (req, res, next) {
    if (util.isArray(req.body)) {
        var voiceBroadcasts = [];
        for (var i = 0; i < req.body.length; i++) {
            voiceBroadcasts.push(new VoiceBroadcast(req.body[i]).toObject());
        }

        VoiceBroadcast.collection.insert(voiceBroadcasts, function (err) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                return res.end();
            }
        });
    } else {
        var voiceBroadcast = new VoiceBroadcast(req.body);
        voiceBroadcast.creator = req.user;
        voiceBroadcast.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                return res.json(voiceBroadcast);
            }
        });
    }
};

exports.list = function (req, res) {
    var filter = {};
    if (!!req.query.keywords) {
        filter.content = new RegExp(req.query.keywords, 'i');
    }
    if (req.query.isEssential !== undefined) {
        filter.isEssential = req.query.isEssential;
    }
    if (!!req.query.startDate) {
        filter.created = filter.created || {};
        filter.created.$gte = new Date(req.query.startDate);
    }
    if (!!req.query.endDate) {
        filter.created = filter.created || {};
        filter.created.$lte = new Date(req.query.endDate);
    }

    VoiceBroadcast.count(filter, function (err, total) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            VoiceBroadcast.find(filter).sort({"created": 1})
                .skip((req.query.page - 1) * req.query.limit).limit(req.query.limit)
                .exec(function (err, voiceBroadcast) {
                    if (err) {
                        return res.status(400).send({
                            message: getErrorMessage(err)
                        });
                    } else {
                        return res.json({total: total, data: voiceBroadcast});
                    }
                });
        }
        //if(req.query.offset){
        //    voiceBroadcast.skip(req.query.offset);
        //}
        //if(req.query.limit){
        //    voiceBroadcast.limit(req.query.limit);
        //}
    });
};

exports.voiceBroadcastById = function (req, res, next, id) {
    if (id.indexOf(',') > 0) {
        next();
    } else {
        console.log(id);
        VoiceBroadcast.findById(id).exec(function (err, voiceBroadcast) {
            if (err) return next(err);
            if (!voiceBroadcast) {
                return next(new Error('文章不存在，id为' + id));
            }
            req.voiceBroadcast = voiceBroadcast;
            next();
        });
    }
};

exports.read = function (req, res) {
    return res.json(req.voiceBroadcast);
};

exports.update = function (req, res) {
    var voiceBroadcast = req.voiceBroadcast;
    voiceBroadcast.isEssential = req.body.isEssential;
    voiceBroadcast.content = req.body.content;
    voiceBroadcast.created = req.body.created;
    voiceBroadcast.save(function (err) {
        if (err) {
            res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            return res.json(voiceBroadcast);
        }
    });
};

exports.delete = function (req, res) {
    if (req.params.voiceBroadcastId) {
        var ids = req.params.voiceBroadcastId.split(',');
        VoiceBroadcast.remove({_id: {$in: ids}}, function (err) {
            res.end();
        });
    } else {
        var voiceBroadcast = req.voiceBroadcast;
        voiceBroadcast.remove(function (err) {
            if (err) {
                res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                return res.json(voiceBroadcast);
            }
        });
    }
};

exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: '请先登录'
        });
    }
    next();
};

exports.hasAuthorization = function (req, res, next) {
    //if (req.VoiceBroadcast.creator !== req.user.id) {
    //    res.status(403).send({
    //        message: '对不起，您没有权限操作该文章'
    //    });
    //}
    next();
};