const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true,
    },
    usuario: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    senha: {
        type: String,
        required: true,
    },
    ehAdm: {
        type: Boolean,
        default: false
    }
    
});

mongoose.model("usuarios", Usuario);
