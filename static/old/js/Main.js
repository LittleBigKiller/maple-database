console.log('Main.js loaded')

class Main {
    constructor() {
        console.log('Main Initialized')
        this.InitListeners()
    }

    NetTest() {
        net.SelectAll()
        net.SelectOne()
        net.Insert()
        net.DeleteId()
        net.UpdateID()
    }

    FillSelect(selectData) {
        let sData = JSON.parse(selectData)
        let select = $('#sID').html('')
        for (let i in sData) {
            let option = $('<option>')
                .attr('value', sData[i]._id)
                .html(sData[i]._id)
            select.append(option)
        }
    }

    FillData(tableData) {
        let dData = JSON.parse(tableData)
        $('#dDisplay').html('')
            .html(JSON.stringify(dData, undefined, 2))
    }

    InitListeners() {
        $('#bAdd').on('click', () => {
            let name = $('#iName').val()
            let pass = $('#iPass').val()

            if (name != '')
                net.Insert(name, pass)

            $('#iName').val('')
            $('#iPass').val('')
        })

        $('#bRefresh').on('click', () => {
            net.SelectAll()
        })

        $('#bDelete').on('click', () => {
            let id = $('#sID').val()
            if (id) {
                net.DeleteID(id)
            }
        })

        $('#bUpdate').on('click', () => {
            let id = $('#sID').val()
            let pass = $('#iPass').val()
            if (id) {
                net.UpdateID(id, pass)
            }

            $('#iName').val('')
            $('#iPass').val('')
        })
    }
}