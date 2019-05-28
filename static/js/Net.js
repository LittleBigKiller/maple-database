console.log('net.js loaded')

class Net {
    constructor() {
        console.log('Net Initialized')
    }

    SelectAll() {
        console.log('net.SelectAll()')
        $.ajax({
            data: {
                type: 'SELECT-ALL'
            },
            type: 'POST',
            success: function (data) {
                console.log(data)
                maple.FillSelect()
                maple.FillData()
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    SelectOne() {
        console.log('net.SelectOne()')
        $.ajax({
            data: {
                type: 'SELECT-ONE'
            },
            type: 'POST',
            success: function (data) {
                console.log(data)
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
                console.log(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    DeleteID(rowId = 0) {
        console.log('net.DeleteID()')
        $.ajax({
            data: {
                type: 'DELETE-ID',
                id: rowId
            },
            type: 'POST',
            success: function (data) {
                console.log(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    UpdateID(rowId = 0) {
        console.log('net.UpdateID()')
        $.ajax({
            data: {
                type: 'UPDATE-ID',
                id: rowId
            },
            type: 'POST',
            success: function (data) {
                console.log(data)
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }
}