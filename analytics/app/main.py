import sys
from flask import Flask, request, jsonify
import ssl
from pymongo import MongoClient
import utils
import reports
import pandas as pd
from apriori_model import AprioriModel, transform_items_to_transactions
from threading import Thread
from bson.objectid import ObjectId


sys.path.append('.')


def create_app():

    settings = {
        'DEBUG': True,
    }

    app = Flask(__name__)
    app.config.update(settings)

    return app


app = create_app()

dev_uri = 'mongodb://mongo1:27017,mongo2:27018,mongo3:27019/mee'
prod_uri = 'mongodb+srv://mee-web:<password>@production-cluster-oty65.gcp.mongodb.net/mee?retryWrites=true&w=majority'

client = MongoClient(prod_uri, ssl_cert_reqs=ssl.CERT_NONE)
db = client['mee']


def background_job():
    print('--- SEND REPORT ---')
    message = reports.get_reports(db)
    utils.send_message(message)


def background_job_reclassify():
    print('--- SEND REPORT ---')
    reports.reclassify(db)

def background_job_associative_analysis(companyId):
    id = ObjectId(companyId)
    sales = pd.DataFrame(list(db.orders.find({ 'company': id, 'status': 'closed' }, { 'items': 1 })))
    transactions = transform_items_to_transactions(sales, attr='product')

    print('id:', id)
    print('sales:', sales)
    print('transactions:', transactions)

    model = AprioriModel()
    model.train(transactions)

    rules = db.associationRules.find({ 'company': id })

    has_rules = len(list(rules))

    print('rules:', has_rules)
    print('model:', model.model)
    sys.stdout.flush()

    if has_rules > 0:
        print('UPDATE', flush=True)
        db.associationRules.update({ 'company': id }, { '$set': { 'rules': model.model } })
    else:
        print('INSERT', flush=True)
        db.associationRules.insert({ 'company': id, 'rules': model.model })

@app.route('/', methods=['GET'])
def hello():
    return jsonify({
        'message': 'Welcome Analytics API'
    })


@app.route('/reports', methods=['POST'])
def send_reports():
    try:
        print('--- RUNNING THREAD ---')
        thread = Thread(target=background_job)
        thread.start()
    except Exception as e:
        print('ERROR:', e)

    return jsonify({
        'message': 'Reports sent to Slack!'
    })


@app.route('/reclassify', methods=['POST'])
def reclassify():
    try:
        print('--- RUNNING THREAD ---')
        thread = Thread(target=background_job_reclassify)
        thread.start()
    except Exception as e:
        print('ERROR:', e)

    return jsonify({
        'message': 'Reclassifying users!'
    })

@app.route('/associative_analysis', methods=['POST'])
def associative_analysis():
    try:
        print('--- RUNNING THREAD ---')

        data = request.get_json()
        print('data:', data)
        thread = Thread(target=background_job_associative_analysis, args=[data.get('companyId')])
        thread.start()
    except Exception as e:
        print('ERROR:', e)

    return jsonify({
        'message': 'Creating associative rules!'
    })


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host="0.0.0.0", debug=True, port=80)
