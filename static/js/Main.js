console.log('Main.js loaded')

class Main {
    constructor() {
        console.log('Main Initialized')
        this.InitListeners()
        this.AskDb()

        this.dbAddress
    }

    async AskDb() {
        let address = window.prompt('Database Server Address?')
        if (address != '' && address != null) {
            let test = await net.RequestDB(address)
            console.log(test)
            if (test == 'NAY') {
                if (window.confirm('Couldn\'t connect to: ' + address + '\nDo you want to try connecting to local server instead?')) {
                    let test1 = await net.RequestLocal()
                    if (test1 == 'YAY') {
                        this.dbAddress = '127.0.0.1'
                        $('#header').addClass('header-connected').removeClass('header-waiting')
                    }
                } else {
                    this.dbAddress = 'Disconnected'
                    $('#header').addClass('header-disconnected').removeClass('header-waiting')
                }
            } else {
                this.dbAddress = address
                $('#header').addClass('header-connected').removeClass('header-waiting')
            }
        } else {
            this.dbAddress = 'Disconnected'
            $('#header').addClass('header-disconnected').removeClass('header-waiting')
        }

        $('#header').html('SpecMyAdmin on: ' + this.dbAddress)
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