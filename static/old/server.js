var http = require('http')
var qs = require('querystring')
var fs = require('fs')
var mongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var Operations = require("./modules/Operations.js")
var PORT = 5500



var dbOps = new Operations()
var _db
var coll


var server = http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url)
    switch (req.method) {
        case 'GET':
            getResponse(req, res)
            break
        case 'POST':
            res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
            postResponse(req, res)
            break
    }
})

server.listen(PORT, function () {
    console.log('serwer started on port: ' + PORT)
})

mongoClient.connect("mongodb://localhost/maple", function (err, db) {
    if (err) console.log(err)
    else console.log("mongo connected")
    _db = db

    db.createCollection("users", function (err, resColl) {
        console.log('Collection users added/exists')
        coll = resColl
    })
})



function getResponse(req, res) {
    if (req.url === '/favicon.ico') {
        fs.readFile(__dirname + '/static/img/logo.png', function (error, data) {
            if (!error) {
                res.writeHead(200, { 'Content-type': 'image/png; charset=utf-8' })
                res.write(data)
                res.end('')
            } else {
                res.end('')
            }
        })
    } else if (req.url.indexOf('.js') != -1) {
        fs.readFile(__dirname + '/static/' + decodeURI(req.url), function (error, data) {
            if (!error) {
                res.writeHead(200, { 'Content-type': 'aplication/javascript; charset=utf-8' })
                res.write(data)
                res.end('')
            } else {
                res.end('')
            }
        })
    } else if (req.url.indexOf('.css') != -1) {
        fs.readFile(__dirname + '/static/' + decodeURI(req.url), function (error, data) {
            if (!error) {
                res.writeHead(200, { 'Content-type': 'text/css; charset=utf-8' })
                res.write(data)
                res.end('')
            } else {
                res.end('')
            }
        })
    } else if (req.url.indexOf('.jpg') != -1) {
        fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
            if (error) {
                fs.readFile(__dirname + '/static/covers/default.jpg', function (error, dataDef) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg; charset=utf-8' })
                    res.write(dataDef)
                    res.end('')
                })
            } else {
                res.writeHead(200, { 'Content-type': 'image/jpeg; charset=utf-8' })
                res.write(data)
                res.end('')
            }
        })
    } else if (req.url.indexOf('.png') != -1) {
        fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
            if (error) {
                fs.readFile(__dirname + '/static/covers/default.jpg', function (error, dataDef) {
                    if (!error) {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg; charset=utf-8' })
                        res.write(dataDef)
                        res.end('')
                    } else {
                        res.end('')
                    }
                })
            } else {
                res.writeHead(200, { 'Content-type': 'image/png; charset=utf-8' })
                res.write(data)
                res.end('')
            }
        })
    } else {
        fs.readFile(__dirname + '/static/index.html', function (error, data) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write(data)
            res.end('')
        })
    }
}

function postResponse(req, res) {
    var reqData = '';
    var resData

    req.on('data', function (data) {
        reqData += data;
    })

    req.on('end', async () => {
        reqData = qs.parse(reqData)
        console.log(reqData)
        if (reqData.type == 'INSERT') {
            let insertData = { name: reqData.name, pass: reqData.pass}
            dbOps.Insert(coll, insertData)
            res.end('')

        } else if (reqData.type == 'SELECT-ALL') {
            resData = await dbOps.SelectAll(coll)
            res.end(resData)

        } else if (reqData.type == 'DELETE-ID') {
            dbOps.DeleteById(ObjectID, coll, reqData.id)
            res.end('')

        } else if (reqData.type == 'UPDATE-ID') {
            let updateData = { id: reqData.id, pass: reqData.pass}
            dbOps.UpdateById(ObjectID, coll, updateData)
            res.end('')

        } else {
            console.error('Invalid request')
            res.end('ERR: Invalid request')
        }
    })
}