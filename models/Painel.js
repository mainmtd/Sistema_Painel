const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Painel = new Schema({
    codigo_painel: {
        type: Number,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        default: ""
    },
    data_alteracao: {
        type: Date,
        default: Date.now()
    },
    alerta: {
        type: Boolean,
        default: false
    },
    ehAlerta: {
        type: Boolean,
        default: false
    }
})

mongoose.model("paineis", Painel);