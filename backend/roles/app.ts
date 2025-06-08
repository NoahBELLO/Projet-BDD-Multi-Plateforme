import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import roleRoutes from "./src/roleRoutes";
import RoleController from "./src/roleController";
import 'dotenv/config';
import { db } from './src/db';

dotenv.config();
const app: Application = express();
const port: number = parseInt(process.env.PORT as string);

const roleController: RoleController = new RoleController();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db()
// app.use(authMiddleware);
app.use("/role", roleRoutes);

// Middleware pour gérer les erreurs 500 (erreurs serveur)
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
);

// Démarrer le serveur
app.listen(port, (): void => {
  console.log(`API en cours d'exécution sur http://localhost:${port} (pour tester avec Postman)`);
  console.log(`API en cours d'exécution sur http://microservice_role:${port} (pour utilisation dans le network Docker)`);
});