const express = require('express');
const app = express();
const path= require("path");
const methodOverride = require('method-override')
const router=require('./routers/main');
const productsRouter = require('./routers/products');

const PORT= process.env.PORT || 3001;


app.use(express.static(path.join('./public')));
app.use(methodOverride('_method'));
app.use("/", router);
app.use('/products', productsRouter);
app.use('/login', router);
app.use('/register', router);
app.use('/about', router);
app.use('/carritoDeCompras', router);







app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Servidor andando en puerto: http://localhost:${PORT}`);
});

/*app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/login', (req,res)=>{
    res.sendFile(__dirname + '/views/login.html');
});
app.get('/carrito', (req,res)=>{
    res.sendFile(__dirname + '/views/carritoDeCompras.html')});
app.get('/register', (req,res)=>{
    res.sendFile(__dirname + '/views/register.html');
});
app.get('/details', (req,res)=>{
    res.sendFile(__dirname + '/views/productDetail.html');
});*/
