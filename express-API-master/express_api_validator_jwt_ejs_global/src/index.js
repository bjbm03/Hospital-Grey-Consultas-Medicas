import express from 'express';
import morgan  from 'morgan';
import cookieParser from 'cookie-parser';
import cors  from'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {router as authRoutes}  from "./routes/authRoutes.js";
import {router as routerUser}  from "./routes/usuariosRouter.js";
import {router as routerPage}  from "./routes/pageRouters.js";
import {router as dashbordRoutes}  from "./routes/dashbordRoutes.js";
import {authMiddleware} from './middleware/authMiddleware.js';
import { viewGlobals } from './middleware/viewGlobals.js'

// Solución para __dirname
const __filename = fileURLToPath(import.meta.url);
console.log("__filename: " + __filename);
const __dirname = dirname(__filename);
console.log("__dirname: " + __dirname);

const app = express();
// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta "views" en tu raíz


const PORT = 3000;
app.use(morgan('dev'));  // Opciones: 'dev', 'combined', 'tiny', 'short', etc.
app.use(cookieParser()); // Para leer cookies

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto en producción
    credentials: true // Permitir cookies en CORS
}));

// File Public
let publicPath = path.resolve(__dirname, 'public');
console.log("publicPath: " + publicPath);
app.use("/public",express.static(publicPath));

app.use("/", routerPage);
app.use('/api/auth',  authRoutes);

app.use(authMiddleware); // Esto establecerá req.user si hay token
app.use(viewGlobals); // Esto establecerá res.locals para las vistas

// Routes Page

app.use("/dashbord", dashbordRoutes);
//app.use("/dashbord",authMiddleware, dashbordRoutes);

// Routes API

app.use("/api", routerUser);
//app.use("/api",authMiddleware, routerUser);

// Middleware
app.use((req, res, next) => {
   // res.status(404).json({ message: "Not found" });
    res.send("Pagina no encontrada");
});

app.listen(PORT);

console.log(`Server on port http://localhost:${PORT}`);