const http = require('http')
const qs = require('querystring')
const fs = require('fs')
const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const Operations = require("./modules/Operations.js")
const PORT = 5500

const dbOps = new Operations()


let dbServer
let dbAdmin
let cDB

let server = http.createServer(function (req, res) {
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
                res.writeHead(200, { 'Content-type': 'application/javascript; charset=utf-8' })
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
    let reqData = '';
    let resData

    req.on('data', function (data) {
        reqData += data;
    })

    req.on('end', async () => {
        reqData = qs.parse(reqData)
        console.log(reqData)
        if (reqData.type == 'CONNECT-DB') {
            mongoClient.connect('mongodb://' + reqData.address + '/admin', (err, db) => {
                if (err) {
                    console.error(err)
                    res.end('NAY')
                    return
                }
                dbAdmin = db
                dbServer = reqData.address
                res.end('YAY')
            })

        } else if (reqData.type == 'CONNECT-LOCAL') {
            mongoClient.connect('mongodb://localhost/admin', (err, db) => {
                if (err) {
                    console.error(err)
                    res.end('NAY')
                    return
                }
                dbAdmin = db
                dbServer = 'localhost'
                res.end('YAY')
            })

        } else if (reqData.type == 'LIST-DB') {
            dbAdmin.admin().listDatabases(function (err, dbs) {
                if (err) {
                    console.log(err)
                    res.end('ERROR')
                    return
                }
                res.end(JSON.stringify(dbs.databases))
            })

        } else if (reqData.type == 'SELECT-DB') {
            mongoClient.connect('mongodb://' + dbServer + '/' + reqData.db, (err, db) => {
                if (err) {
                    console.error(err)
                    res.end('NAY')
                    return
                }
                cDB = db
                res.end('YAY')
            })

        } else if (reqData.type == 'DELETE-DB') {
            cDB.dropDatabase((err, result) => {
                if (err) {
                    console.error(err)
                    res.end('NAY')
                    return
                }
                cDB = null
                res.end('YAY')
            })

        } else if (reqData.type == 'CREATE-DB') {
            mongoClient.connect('mongodb://' + dbServer + '/' + reqData.db, (err, db) => {
                if (err) {
                    console.error(err)
                    res.end('NAY')
                    return
                }
                db.createCollection(reqData.coll, (err, db) => {
                    if (err) {
                        console.error(err)
                        res.end('NAY')
                        return
                    }
                    res.end('YAY')
                })
            })

        } else if (reqData.type == 'LIST-COLL') {
            cDB.listCollections().toArray(function (err, cNames) {
                if (err) {
                    console.log(err)
                    res.end('ERROR')
                    return
                }
                res.end(JSON.stringify(cNames))
            })

        } else if (reqData.type == 'DELETE-COLL') {
            cDB.collection(reqData.coll).drop()
            res.end('')

        } else if (reqData.type == 'CREATE-COLL') {
            cDB.createCollection(reqData.coll, (err, db) => {
                if (err) {
                    console.error(err)
                    res.end('NAY')
                    return
                }
                res.end('YAY')
            })

        // ======================================
        //   vvv       UNSTABLE AF          vvv  
        // ======================================
        } else if (reqData.type == 'LIST-DOC') {
            let coll = cDB.collection(reqData.coll)
            resData = await dbOps.SelectAll(coll)
            res.end(resData)

        } else if (reqData.type == 'DELETE-DOC') {
            let coll = cDB.collection(reqData.coll)
            dbOps.DeleteById(ObjectID, coll, reqData.docId)
            res.end('')

        } else if (reqData.type == 'CREATE-DOC') {
            let coll = cDB.collection(reqData.coll)
            dbOps.Insert(coll, {})
            res.end('')

        } else if (reqData.type == 'UPDATE-DOC') {
            let coll = cDB.collection(reqData.coll)
            let updateData = JSON.parse(reqData.data)
            let id = updateData._id
            delete updateData._id
            dbOps.UpdateById(ObjectID, coll, id, updateData)
            res.end('')
        // ======================================
        //   ^^^       UNSTABLE AF          ^^^  
        // ======================================

        } else {
            console.error('Invalid request')
            res.end('ERR: Invalid request')
        }
    })
}