const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

const USUARIO_MOCKADO = {
    id: 1,
    nome: 'João',
    email: 'joao@gmail.com',
    usuario: 'admin',
    senha: '123456'
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'pao-de-batata',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 30
    }
}))

function protegerRota(req, res, next) {
    if(!req.session.usuario) {
        return res.status(401).json({
            mensagem: 'Acesso negado. Faça login primeiro'
        })
    }
    next();
}

app.get('/api/publica', (req, res)=>{

    res.json({
        mensagem: 'Essa rota é publica !!!',
        logado: !!req.session.usuario
    });
});

app.post('/api/login', (req, res)=>{
    const {usuario, senha} = req.body;

    if(usuario === USUARIO_MOCKADO.usuario && senha === USUARIO_MOCKADO.senha){
        req.session.usuario = {
            id: USUARIO_MOCKADO.id,
            nome: USUARIO_MOCKADO.nome,
            email: USUARIO_MOCKADO.email
        }
        return res.json({
            mensagem: 'Login realizado com sucesso',
            usuario: req.session.usuario
        })
    }

    res.status(401).json({mensagem: 'Usuário ou senha inválidos !!!'});
});

app.get('/api/protegida', protegerRota, (req,res)=> {
    res.json({
        mensagem: 'Você acessou uma rota protegida usando session.',
        usuario: req.session.usuario
    })
})

app.get('/api/status', (req, res)=>{
    req.session.destroy(()=> {
        res.clearCookie('connect.sid');
        res.json({mensagem: 'Logout realizado com sucesso'});
    });
});

app.listen(PORT, ()=> {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})