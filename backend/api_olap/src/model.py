from tools.clickhouse import ClickHouseDB
from loguru import logger

_table_train_session = "train_sessions"
_table_train_purchases = "train_purchases"

class TableTrain(ClickHouseDB): 
    def __init__(self, host=None, port=None, database=None, user=None, password=None):
        super().__init__(host, port, database, user, password)

    def format_for_db(self, datas):
        item_id = datas['item_id']
        limit = datas['limit']
        return item_id, limit
    
    def fetch_all(self):
        sql = f"SELECT * FROM train_purchases"
        return self.query(sql)
    
    def get_reccomandation(self, datas):
        item_id, limit = self.format_for_db(datas)

        query = (
            f"SELECT {_table_train_purchases}.item_id, "
            f"COUNT({_table_train_purchases}.item_id) AS nombreDeFoisItemVu "
            f"FROM {_table_train_session} "
            f"INNER JOIN {_table_train_purchases} "
            f"ON {_table_train_session}.session_id = {_table_train_purchases}.session_id "
            f"WHERE {_table_train_session}.item_id = {int(item_id)} "
            f"GROUP BY {_table_train_purchases}.item_id "
            f"ORDER BY nombreDeFoisItemVu DESC, {_table_train_purchases}.item_id ASC "
            f"LIMIT {int(limit)}"
        )

        logger.critical(f"🔍 Requête envoyée à ClickHouse : {query}")
        logger.critical(query)
        result = self.query(query)
        logger.critical(result)
        return result