console.log('net.js loaded')

let pClass

class Net {
    constructor() {
        console.log('Net Initialized')
        pClass = this
        /* this.SelectAll() */
    }

    RequestSrv(address) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'CONNECT-DB',
                    address: address
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    RequestLocal() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'CONNECT-LOCAL'
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    ListDB() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'LIST-DB'
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    SelectDB(dbName) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'SELECT-DB',
                    db: dbName
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    CreateDB(dbName, collName) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'CREATE-DB',
                    db: dbName,
                    coll: collName
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    DeleteDB() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'DELETE-DB'
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    ListColl() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'LIST-COLL'
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    /* SelectColl() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'SELECT-COLL'
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    } */

    CreateColl(collName) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'CREATE-COLL',
                    coll: collName
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }

    DeleteColl(collName) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                data: {
                    type: 'DELETE-COLL',
                    coll: collName
                },
                type: 'POST',
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    console.log(error)
                },
            })
        })
    }
}