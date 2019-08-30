const express = require('express');
const router = express.Router();
mongoose = require('mongoose');

require("../models/Painel");
const Painel = mongoose.model("paineis");
const {autenticado} = require("../helpers/helpersAcesso")

router.get('/', autenticado, async (req, res) => {
    await Painel.find().then((painel) => {
        res.render("painel/gerenciapainel", {painel: painel, layout: "maingerenciador"})
    })
});



router.get("/edit/:id",autenticado, (req, res) => {
    Painel.findOne({_id: req.params.id}).then((painel) => {
        res.render("painel/editpainel", {painel: painel, layout: "maingerenciador"})
    }).catch((err) => {
       req.flash("error_msg", "Não foi possível carregar o painel, por favor, tente novamente")
       res.redirect("/painel/gerenciapainel")
    })
    
});

router.post("/edit", autenticado, (req, res) => {
    Painel.findOne({_id: req.body.id}).then((painel) => {
        painel.conteudo = req.body.conteudo
        painel.data_alteracao = Date.now()
        painel.alerta = req.body.alerta

        painel.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/painel/")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao cadastrar novo conteúdo no painel: " + painel.nome)
            res.redirect("/painel/")
        })
    })
})


module.exports = router;