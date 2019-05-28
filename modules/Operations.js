module.exports = function () {

    var opers = {
        Insert: function (collection, data) {
            collection.insert(data, function (err, result) {
                console.log(result)
            })
        },

        SelectAll: function (collection) {
            return new Promise(async resolve => {
                collection.find({}).toArray(function (err, items) {
                    resolve(JSON.stringify(items))
                })
            })
        },
        
        DeleteById: function (ObjectID, collection, id) {
            collection.remove({ _id: ObjectID(id) }, function (err, data) {
                console.log(data)
            })
        },

        UpdateById: function (ObjectID, collection, data) {
            collection.updateOne(
                { _id: ObjectID(data.id) },
                { $set: { pass: data.pass } },
                function (err, data) {
                    console.log("update: " + data)
                })
        },
    }

    return opers

}