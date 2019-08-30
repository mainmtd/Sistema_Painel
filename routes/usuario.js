const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require('bcryptjs');
const passport = require("passport");
const {ehAdmin} = require("../helpers/helpersAcesso");
const {autenticado} = require("../helpers/helpersAcesso");

module.exports = router;

router.get("/", ehAdmin, async (req, res) => {
    await Usuario.find().then((user) => {
        res.render("usuario/gerenciausuario", {usuario: user, layout: "maingerenciador"})
    })
});

router.get("/confirmaDel/:id",ehAdmin, (req, res) => {
    Usuario.findOne({_id: req.params.id}).then((usuario) => {
        res.render("usuario/confirmaDel", {usuario: usuario, layout: "maingerenciador"})
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível excluir usuário, por favor, tente novamente")
        res.redirect("/usuario/gerenciausuario")
    })
})

router.get("/trocasenha/:id", ehAdmin, (req, res) => {
    Usuario.findOne({_id: req.params.id}).then((usuario) => {
        res.render("usuario/trocasenha", {usuario: usuario, layout: "maingerenciador"})
    }).catch((err) => {
       req.flash("error_msg", "Não foi possível carregar o usuário, por favor, tente novamente")
       res.redirect("/usuario/gerenciausuario")
    })
})



router.post("/trocasenha/", ehAdmin, (req, res) => {
    var erros = verificaSenha(req.body);
    if(erros.length > 0){
        const novoUsuario = new Usuario({
            _id: req.body.id,
            nome: req.body.nome 
        });
        res.render("usuario/trocasenha", {layout: "maingerenciador", usuario: novoUsuario, erros: erros})
    }else {
        
        Usuario.findOne({_id: req.body.id}).then((usuario) => {
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(req.body.senha, salt, (erro, hash) => {
                    if(erro){
                        req.flash("error_msg", "Houve um erro ao trocar senha")
                        res.redirect("/usuario/")
                    }
                    
                    usuario.senha = hash
                    
                    usuario.save().then(() => {
                        req.flash("success_msg", "Senha alterada com sucesso!")
                        res.redirect("/usuario/")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao trocar a senha.")
                        res.redirect("/usuario/")
                    })
                })
            })
        })
    }
});



router.get("/registro", ehAdmin, (req, res) => {
    res.render("usuario/registro", {layout: "maingerenciador"})
});



router.post("/registro", ehAdmin,  async (req, res) => {
    var erros = await verificaCampos(req.body);
    if(erros.length > 0){
        res.render("usuario/registro", {layout: "maingerenciador", erros: erros})
    }else{
        Usuario.findOne({usuario: req.body.usuario}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "já existe uma conta com este usuário.")
                res.redirect("../painel")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    usuario: req.body.usuario,
                    senha: req.body.senha,
                    ehAdm: req.body.ehAdm
                })
                
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro ao salvar usuário.")
                            res.redirect("../painel")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso!")
                            res.redirect("../painel")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente.")
                            res.redirect("../painel")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno.");
            res.redirect("../painel")
        })
    }
    
});

router.get("/login", (req, res) => {
    res.render("usuario/login", {layout: "maingerenciador"})
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/painel/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)
})



router.post("/delete", (req, res) => {
    Usuario.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Usuário excluído com sucesso.")
        res.redirect("/usuario/")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao excluir usuário.")
        res.redirect("/usuario/")
    })
})

router.get("/logout", autenticado, (req, res) => {
    req.logout()
    res.redirect("/usuario/login")
})

function verificaCampos(requisicao){
    var erros = [];
    if(!requisicao.nome || typeof requisicao.nome == undefined || requisicao.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!requisicao.usuario || typeof requisicao.usuario == undefined || requisicao.usuario == null){
        erros.push({texto: "Usuário inválido"})
    }
    if(!requisicao.senha || typeof requisicao.senha == undefined || requisicao.senha == null){
        erros.push({texto: "Senha inválida"})
    }
    if(requisicao.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(requisicao.senha != requisicao.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente"})
    }

    return erros;
}

function verificaSenha(requisicao){
    var erros = [];
    if(!requisicao.senha || typeof requisicao.senha == undefined || requisicao.senha == null){
        erros.push({texto: "Senha inválida"})
    }
    if(requisicao.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(requisicao.senha != requisicao.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente"})
    }

    return erros;
}
