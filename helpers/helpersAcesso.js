module.exports = {
    ehAdmin : function(req, res, next){
        if(req.isAuthenticated() && req.user.ehAdm){
            return next();
        }
        req.flash("error_msg", "Usuário não autorizado")
        res.redirect("/usuario/login")
    },
    autenticado : function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Você precisa efetuar login para acessar essa área")
        res.redirect("/usuario/login")
    }
}