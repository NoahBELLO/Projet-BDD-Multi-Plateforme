import clickhouse_connect
import os
from loguru import logger
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

class ClickHouseDB:
    def __init__(self, host=None, port=None, database=None, user=None, password=None):
        logger.critical('ClickHouseDB en cours de connexion')
        # Charger les valeurs par défaut depuis les variables d'environnement si aucun argument n'est passé
        self.host = host or os.getenv("CLICKHOUSE_HOST", "clickhouse_container")
        self.port = int(port or os.getenv("CLICKHOUSE_PORT", 8123))
        self.database = database or os.getenv("CLICKHOUSE_DATABASE", "default")
        self.user = user or os.getenv("CLICKHOUSE_USER", "default")
        self.password = password or os.getenv("CLICKHOUSE_PASSWORD", "root")
        logger.critical(f"{self.port}, {self.database}, {self.user,} {self.password}")

        try:
            self.client = clickhouse_connect.get_client(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.user,
                password=self.password
            )
            logger.info(f"✅ Connexion réussie à ClickHouse ({self.host}:{self.port}) sur la base '{self.database}'")
        except Exception as e:
            logger.critical("❌ Erreur de connexion à ClickHouse")
            logger.exception(e)
            self.client = None


    def query(self, sql):
        """ Exécute une requête SQL et retourne les résultats """
        if not self.client:
            logger.error("⚠️ Client ClickHouse non connecté")
            return None

        try:
            result = self.client.query(sql)
            return result.result_rows
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'exécution de la requête: {sql}")
            logger.exception(e)
            return None

    def close(self):
        """ Ferme la connexion """
        if self.client:
            self.client.close()
            logger.info("🔌 Connexion à ClickHouse fermée")
