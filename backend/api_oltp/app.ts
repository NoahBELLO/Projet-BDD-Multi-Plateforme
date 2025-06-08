import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import Routes from "./src/routes";
import Controllers from "./src/controllers";
import 'dotenv/config';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.Api_Port as string);

const controllers: Controllers = new Controllers();
app.use(express.json());

app.use("/apiPostgreSql", Routes);

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
);

app.listen(port, (): void => {
  console.log(`API en cours d'exécution sur http://localhost:${port} (pour tester avec Postman)`);
  console.log(`API en cours d'exécution sur http://api_oltp:${port} (pour utilisation dans le network Docker)`);
});