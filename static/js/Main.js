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
        console.log(selectData)
    }

    FillData(tableData) {
        console.log(tableData)
    }

    InitListeners() {
        $('#bAdd').on('click', () => {
            let name = $('#iName').val()
            let pass = $('#iPass').val()
            net.Insert(name, pass)
        })

        $('#bRefresh').on('click', () => {
            net.SelectAll()
        })

        $('#bDelete').on('click', () => {
            let id = $('#sID').val()
            console.log('temp_Remove: ' + id)
            if (id) {
                console.log('Remove: ' + id)
            }
        })

        $('#bUpdate').on('click', () => {
            let id = $('#sID').val()
            console.log('temp_Update: ' + id)
            if (id) {
                console.log('Update: ' + id)
            }
        })
    }
}