import express from 'express';
import morgan  from 'morgan';
import cookieParser from 'cookie-parser';
import cors  from'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// Import router
import {router as consultasRoutes}  from './routes/consultasRoutes.js';
import {router as routerPage}  from "./routes/pageRouter.js";
import {router as authRoutes}  from "./routes/authRoutes.js";
import {router as dashbordRoutes}  from "./routes/dashbordRoutes.js";
import {router as historialRouters}  from "./routes/historialRouters.js";
// Import authMiddleware
import {authMiddleware} from './middleware/authMiddleware.js';
import { viewGlobals } from './middleware/viewGlobals.js'

// Solución para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let publicPath = path.resolve(__dirname, 'public');
console.log("publicPath: " + publicPath);

const app = express();
const port = 3000;

// crear la carpeta Public
app.use("/public",express.static(publicPath));
// Middleware
app.use(morgan('dev'));// Opciones: 'dev', 'combined', 'tiny', 'short', etc.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // Para leer cookies
app.use(cors({
    origin: 'http://localhost:3000', // Origen de tu frontend
    credentials: true, // Para permitir cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Métodos permitidos
  }));
// Asegúrate de tener esto para las cookies
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta "views" en tu raíz

/**  ROUTES PUBLIC  **/

app.use("/", routerPage);
app.use('/api/auth',  authRoutes);

/** START ROUTES &  MIDDLEWARE PRIVATE **/

app.use(authMiddleware); // Esto establecerá req.user si hay token
app.use(viewGlobals); // Esto establecerá res.locals para las vistas

app.use("/dashboard", dashbordRoutes);
app.use('/consulta/api', consultasRoutes);
app.use('/historia/api', historialRouters);

/** END ROUTES &  MIDDLEWARE PRIVATE **/

// Middleware Pagina no encontrada
app.use((req, res, next) => {
  // res.status(404).json({ message: "Not found" });
   res.send("Pagina no encontrada");
});

app.listen(port);

console.log(`Server on port http://localhost:${port}`)