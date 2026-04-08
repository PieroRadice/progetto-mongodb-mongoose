const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    subTitle : String,
    autori: [String],
    formato: [String],
})

bookSchema.methods.contaAutori = function contaAutori() {
    return this.autori.length
}

module.exports = mongoose.model('Books', bookSchema);