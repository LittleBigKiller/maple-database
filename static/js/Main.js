console.log('Main.js loaded')

class Main {
    constructor() {
        console.log('Main Initialized')

        this.dbAddress = 'NOT CONNECTED'
        this.connected = false
        this.cDB = null
        this.cColl = null
        this.cDoc = null

        this.InitListeners()
        this.AskSrv()
    }

    async AskSrv() {
        let address = window.prompt('Database Server Address?')

        if (address != null) {
            let test = await net.RequestSrv(address)
            if (test != 'YAY') {
                if (window.confirm('Couldn\'t connect to: ' + address + '\nDo you want to try connecting to local server instead?')) {
                    let test1 = await net.RequestLocal()
                    if (test1 == 'YAY') {
                        this.dbAddress = 'localhost'
                        this.connected = true
                        $('#header').addClass('header-connected').removeClass('header-waiting')
                        $('#panel-blackout').css('display', 'none')
                    } else {
                        $('#header').addClass('header-disconnected').removeClass('header-waiting')
                    }
                } else {
                    $('#header').addClass('header-disconnected').removeClass('header-waiting')
                }
            } else {
                this.dbAddress = address
                this.connected = true
                $('#header').addClass('header-connected').removeClass('header-waiting')
                $('#panel-blackout').css('display', 'none')
            }
        } else {
            $('#header').addClass('header-disconnected').removeClass('header-waiting')
        }

        $('#header').html('SpecMyAdmin on: ' + this.dbAddress)

        this.AskDB()
    }

    async AskDB() {
        if (this.connected) {
            let dbList = $('#db-list').empty()
            let dbs = JSON.parse(await net.ListDB())
            for (let i in dbs) {
                if (dbs[i].name == 'admin' || dbs[i].name == 'local' || dbs[i].name == 'config') continue

                let dbObject = $('<div>').addClass('list-object').html(dbs[i].name)
                dbList.append(dbObject)
                dbObject.on('click', async (e) => {
                    let test = await net.SelectDB(e.target.innerHTML)

                    if (test == 'YAY') {
                        $('#db-header-content').html(e.target.innerHTML)
                        this.cDB = e.target.innerHTML

                        this.cColl = null
                        $('#coll-header-content').html('')

                        $('#doc-list').empty().attr('readonly')
                        $('#doc-header-select').empty()
                        this.cDoc = null

                        this.AskColl()
                    }
                })
            }
        }
    }

    async RemoveDB() {
        if (this.cDB != null) {
            await net.DeleteDB(this.cDB)

            $('#db-header-content').empty()
            this.cDB = null

            $('#coll-list').empty()
            $('#coll-header-content').empty()
            this.cColl = null

            $('#doc-list').empty().attr('readonly')
            $('#doc-header-select').empty()
            this.cDoc = null

            this.AskDB()
        }
    }

    async MakeDB(dbName, collName) {
        await net.CreateDB(dbName, collName)

        this.AskDB()
    }

    async AskColl() {
        let collList = $('#coll-list').empty()
        let colls = JSON.parse(await net.ListColl())
        for (let i in colls) {
            let collObject = $('<div>').addClass('list-object').html(colls[i].name)
            collList.append(collObject)
            collObject.on('click', async (e) => {
                $('#coll-header-content').html(e.target.innerHTML)

                this.cColl = e.target.innerHTML

                $('#doc-list').empty().attr('readonly')
                $('#doc-header-select').empty()
                this.cDoc = null

                this.AskDoc()
            })
        }
    }

    async RemoveColl() {
        if (this.cColl != null) {
            await net.DeleteColl(this.cColl)

            $('#coll-header-content').empty()
            this.cColl = null

            $('#doc-list').empty().attr('readonly')
            $('#doc-header-select').empty()
            this.cDoc = null

            this.AskColl()
        }
    }

    async MakeColl(name) {
        await net.CreateColl(name)

        this.AskColl()
    }

    async AskDoc() {
        let docs = JSON.parse(await net.ListDoc(this.cColl))

        let select = $('#doc-header-select').empty()
        for (let i in docs) {
            let option = $('<option>')
            option.html(docs[i]._id).val(docs[i]._id)
            select.append(option)
        }
        select.prop("selectedIndex", -1)

        select.on('change', (e) => {
            $('#doc-list').empty().attr('readonly')
            this.cDoc = e.target.value
            this.FillDocBox()
        })
    }

    async FillDocBox() {
        let docs = JSON.parse(await net.ListDoc(this.cColl))
        for (let i in docs) {
            if (docs[i]._id == this.cDoc) $('#doc-list').html(JSON.stringify(docs[i], null, 2)).attr('readonly')
        }
    }

    async RemoveDoc() {
        if (this.cDoc != null) {
            await net.DeleteDoc(this.cColl, this.cDoc)

            $('#doc-list').empty()
            $('#doc-header-select').empty()
            this.cDoc = null

            this.AskDoc()
        }
    }

    async MakeDoc() {
        /* await net.CreateColl()

        this.AskColl() */
    }

    InitListeners() {
        $('#bDBCreate').on('click', () => {
            this.MakeDB(window.prompt('Database Name?'), window.prompt('Collection Name?'))
        })
        $('#bDBDelete').on('click', () => {
            this.RemoveDB()
        })
        $('#bCollCreate').on('click', () => {
            this.MakeColl(window.prompt('Collection Name?'))
        })
        $('#bCollDelete').on('click', () => {
            this.RemoveColl()
        })
        $('#bDocCreate').on('click', () => {
            this.MakeDoc()
        })
        $('#bDocDelete').on('click', () => {
            this.RemoveDoc()
        })
        $('#bDocEdit').on('click', () => {
            if (this.cDoc)
                $('#doc-list').removeAttr('readonly')
        })
        $('#bDocSave').on('click', () => {
            this.RemoveDoc()
        })
    }
}