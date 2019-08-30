//Carga de módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const painel = require("./routes/painel");
const app = express();
require("./models/Painel");
const Painel = mongoose.model("paineis");
const usuario = require("./routes/usuario");
const passport = require('passport');
require("./config/auth")(passport);
const server = require(('http')).createServer(app);
const io = require('socket.io')(server);
const listaPaineis = require("./helpers/buscaPaineis")



//Configs    
//Sessão
app.use(session({
    secret: "default@secret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

//Middlewares
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
})

//Configuração Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dbpainel").then(() => {
    console.log("Conectado ao MongoDB")
}).catch((err) => {
    console.log("Erro ao se conectar: " + err)
})

//Public
app.use(express.static(path.join(__dirname, "public")));


//Rotas
// URL direta do painel    
app.get('/', async (req, res) => {
    var Paineis = [];
    Painel.find().then((paineis) => {

        Paineis.painel_noticias = paineis.find(pnl => pnl.codigo_painel == 0);
        Paineis.painel_gestao = paineis.find(pnl => pnl.codigo_painel == 1);
        Paineis.painel_acontece = paineis.find(pnl => pnl.codigo_painel == 2);
        if (paineis[3].alerta) {
            Paineis.painel_alerta = paineis.find(pnl => pnl.codigo_painel == 3);
        }
        Paineis = paineis
    })

    res.render("home", {
        Painel: Paineis
    });
});

io.on('connection', socket => {
    console.log("Nova sessão conectada ")
    socket.on("atualizaPaineis", data => {
        socket.broadcast.emit('atualiza')
    })
});
// Rotas do gerenciador de paineis
app.use('/painel', painel);
app.use('/usuario', usuario);


//Config porta e iniciar servidor
const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
    console.log("Servidor rodando!")
})