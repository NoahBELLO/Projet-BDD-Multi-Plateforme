import { Request, Response } from 'express';
import client from './db';

class Controller {
    async getRecommandation(req: Request, res: Response): Promise<void> {
        try {
            const { item_id, limit } = req.query;

            const results = await client.query(
                `SELECT achat.item_id AS item, 
                COUNT(achat.item_id) AS nombreDeFoisItemVu 
                FROM train_sessions AS sessions 
                INNER JOIN train_purchases AS achat ON sessions.session_id = achat.session_id 
                WHERE sessions.item_id = $1
                GROUP BY item
                ORDER BY nombreDeFoisItemVu DESC, item ASC
                LIMIT $2`,
                [item_id, limit]
            );

            const achatsList = results.rows;

            const listeRecommandation = achatsList.map((achat: { item : number }) => achat.item );

            // Envoi de la réponse avec la liste des recommandations
            res.status(200).json({ "recommendations": listeRecommandation });

        }
        catch (err) {
            console.error('Erreur:', err);
            res.status(500).json({ message: "Aucune recommandation trouvée" });
        }
    }

    async getRecommandationComplexe(req: Request, res: Response): Promise<void> {
        try {
            const { item_id, limit } = req.body;
            res.status(200).json({ "item_id": item_id, "limit": limit });
            // const results = await client.query(
            //     `SELECT achat.item_id FROM train_sessions AS sessions 
            //     INNER JOIN train_purchases AS achat ON sessions.session_id = achat.session_id WHERE sessions.item_id = $1 LIMIT $2`,
            //     [item_id, limit]
            // );

            // const achatsList = results.rows;

            // const listeRecommandation = achatsList.map((achat: { item_id: string }) => achat.item_id);

            // // Envoi de la réponse avec la liste des recommandations
            // res.status(200).json({ "recommendations": listeRecommandation });

        }
        catch (err) {
            console.error('Erreur:', err);
            res.status(500).json({ message: "Aucune recommandation trouvée" });
        }
    }
}

export default Controller;