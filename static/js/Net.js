console.log('net.js loaded')

let pClass

class Net {
    constructor() {
        console.log('Net Initialized')
        pClass = this
        /* this.SelectAll() */
    }

    RequestDB(address) {
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

    SelectAll() {
        console.log('net.SelectAll()')
        $.ajax({
            data: {
                type: 'SELECT-ALL'
            },
            type: 'POST',
            success: function (data) {
                maple.FillSelect(data)
                maple.FillData(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    Insert(name, pass) {
        console.log('net.Insert()')
        $.ajax({
            data: {
                type: 'INSERT',
                name: name,
                pass: pass
            },
            type: 'POST',
            success: function (data) {
                pClass.SelectAll()
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    DeleteID(rowId) {
        console.log('net.DeleteID()')
        $.ajax({
            data: {
                type: 'DELETE-ID',
                id: rowId
            },
            type: 'POST',
            success: function (data) {
                pClass.SelectAll()
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    UpdateID(rowId, pass) {
        console.log('net.UpdateID()')
        $.ajax({
            data: {
                type: 'UPDATE-ID',
                id: rowId,
                pass: pass
            },
            type: 'POST',
            success: function (data) {
                pClass.SelectAll()
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }
}