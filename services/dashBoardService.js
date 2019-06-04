/**
 * @description Dashboard Service library.
 * @name dashBordService.js
 * @version 1.1.2
 * @author Super-Sean1995
 */

'use strict';
// Import npm modules.
var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres:Rango941001top@@@@localhost:5433/instagram_dev');

// Definition Dashboard Service module.
var DashBordService = {};

DashBordService.getBotDetails = getBotDetails;
DashBordService.getHistories = getHistories;

function getBotDetails(userId, cb) {
    var selectQuery = 'SELECT \
                            b.id AS botid, \
                            b.botname AS botname, \
                            c.image AS clientimage, \
                            c.clientid AS clientid, \
                            c.clientname AS clientname,\
                            max(c."createdAt") AS max, \
                            count(c.message) AS count \
                        FROM \
                            public."Users" AS a, \
                            public."Bots" AS b, \
                            public."RepliesHistories" AS c \
                        WHERE \
                            CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND \
                            b.id = c.botid AND \
                            a.id = ? \
                        GROUP BY \
                            b.id, \
                            b.botname, \
                            c.image, \
                            c.clientid, \
                            c.clientname';

    sequelize.query(selectQuery, { replacements: [userId], type: sequelize.QueryTypes.SELECT })
        .then(function(result) {
            var arrSendData = [];

            for(var obj of result) {
                convertTime(obj.max, function(cb) {
                    var last = cb;

                    var sendObj = {
                        botId: obj.botid,
                        botName: obj.botname,
                        image: obj.clientimage,
                        clientId: obj.clientid,
                        clientName: obj.clientname,
                        last: last,
                        count: obj.count
                    }

                    arrSendData.push(sendObj);
                });
            }

            cb(arrSendData);

            arrSendData = [];
        })
        .catch(function(error) {
            console.log('Get Bot Detail error in dashboard: ' + error);
        });
}

/**
 * 
 * @param {INTEGER} state 
 * @param {INTEGER} userId 
 * @param {OBJECT} cb 
 */
function getHistories(state, userId, cb) {
    var selectQuery = '';
    switch (state) {
        case 1: // Today
            selectQuery = `(SELECT  'reply' as type,
                                a.id AS userid,
                                b.id AS botid,
                                b.botname AS botname,
                                count(c.botid) AS count
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."RepliesHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") = DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)
                            union all
                            (SELECT  'comment',
                                a.id,
                                b.id ,
                                b.botname ,
                                count(c.botid)
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."CommentHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") = DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)`;
            break;
        case 2: // Yesterday
            selectQuery = `(SELECT  'reply' as type,
                                a.id AS userid,
                                b.id AS botid,
                                b.botname AS botname,
                                count(c.botid) AS count
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."RepliesHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(NOW())-1 AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)
                            union all
                            (SELECT  'comment',
                                a.id,
                                b.id ,
                                b.botname ,
                                count(c.botid)
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."CommentHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(NOW())-1 AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)`;
            break;
        case 3: // Week
            selectQuery = `(SELECT  'reply' as type,
                                a.id AS userid,
                                b.id AS botid,
                                b.botname AS botname,
                                count(c.botid) AS count
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."RepliesHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(NOW())-7 AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)
                            union all
                            (SELECT  'comment',
                                a.id,
                                b.id ,
                                b.botname ,
                                count(c.botid)
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."CommentHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(NOW())-7 AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)`;   
            break;
        case 4: // Month
            selectQuery = `(SELECT  'reply' as type,
                                a.id AS userid,
                                b.id AS botid,
                                b.botname AS botname,
                                count(c.botid) AS count
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."RepliesHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(DATE(NOW()) - interval '1 month') AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)
                            union all
                            (SELECT  'comment',
                                a.id,
                                b.id ,
                                b.botname ,
                                count(c.botid)
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."CommentHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(DATE(NOW()) - interval '1 month') AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)`;
            break;
        case 5: // Year
            selectQuery = `(SELECT  'reply' as type,
                                a.id AS userid,
                                b.id AS botid,
                                b.botname AS botname,
                                count(c.botid) AS count
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."RepliesHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(DATE(NOW()) - interval '1 year') AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)
                            union all
                            (SELECT  'comment',
                                a.id,
                                b.id ,
                                b.botname ,
                                count(c.botid)
                            FROM    public."Users" AS a,
                                public."Bots" AS b,
                                public."CommentHistories" AS c
                            WHERE   CAST(a.id AS DECIMAL) = CAST(b.userid AS DECIMAL) AND
                                b.id = c.botid AND
                                a.id = ? AND
                                DATE(c."createdAt") BETWEEN DATE(DATE(NOW()) - interval '1 year') AND DATE(NOW())
                            GROUP BY a.id,
                                b.id,
                                b.botname
                            ORDER BY
                                b.id)`;
            break;
    
        default:
            break;
    }

    sequelize.query(selectQuery, {
        replacements: [
            userId,
            userId
        ]
    }).then(function(result) {
        cb(result[0]);
    }).catch(function(error) {
        console.log('Get History count data error: ' + error);
    });
}

function convertTime(mili, callback) {
    var delta = parseInt((parseInt(new Date().getTime()) - parseInt(new Date(mili).getTime())) / ( 1000 * 60 ));

    if( delta < 60 ) {
        callback(delta + ' minutes ago'); 
    } else if( 60 < delta < 3600) {
        delta = parseInt(delta / 60)
        callback(delta + ' hours ago');
    } else if( 3600 < delta < 86400 ) {
        delta = parseInt(delta /  86400);
        callback(delta + ' days ago');
    }
}

// Export DashBordService module.
module.exports = DashBordService;