from flask import Flask
from dotenv import load_dotenv
import os
from src.model import TableTrain
import src.routes
from loguru import logger

# Charger les variables d'environnement depuis .env
load_dotenv()

app = Flask(__name__)

# Charger la configuration ClickHouse depuis .env
app.config['CLICKHOUSE_HOST'] = os.getenv('CLICKHOUSE_HOST', 'clickhouse_container')
app.config['CLICKHOUSE_PORT'] = int(os.getenv('CLICKHOUSE_PORT', 8123))
app.config['CLICKHOUSE_DATABASE'] = os.getenv('CLICKHOUSE_DATABASE', 'default')
app.config['CLICKHOUSE_USER'] = os.getenv('CLICKHOUSE_USER', 'default')
app.config['CLICKHOUSE_PASSWORD'] = os.getenv('CLICKHOUSE_PASSWORD', 'root')


# Création de l'instance ClickHouse
logger.critical('début du log')
table_train = TableTrain()

# Enregistrer le blueprint des routes
app.register_blueprint(src.routes.bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

