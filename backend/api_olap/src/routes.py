from flask import Blueprint, jsonify, request
from src.model import TableTrain
import os, json
from loguru import logger

bp = Blueprint('routes', __name__)
@bp.route('/all', methods=['GET'])
def hello():
 return jsonify({"message": "Hello, World!"})


# @bp.route('/all', methods=['GET'])
# def get_trains():
#     try:
#         db = TableTrain()
#         data = db.fetch_all()
#         return jsonify({"data": data})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@bp.route('/reccomandation', methods=['POST'])
def get_reccomandation():
    try:
        logger.critical(request.json) #transmet item_id
        db = TableTrain()
        data = db.get_reccomandation(request.json)
        return jsonify({"result": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
