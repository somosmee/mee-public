import pandas as pd
from apyori import apriori

def transform_items_to_transactions(sales, attr='name'):
    transactions = []
    for i in range(0, sales.shape[0]):
        items = []
        for j in range(0, len(sales['items'][i])):
            item = sales['items'][i][j]
            items.append(str(item[attr]))
        transactions.append(items)
    return transactions

class AprioriModel:
    def __init__(self):
        self.model = {}

    def transform_results_to_dict(self, results):
        kv = {}
        for i in range(0, results.shape[0]):
            key = str(list(results.ordered_statistics[i][0].items_base)[0])
            value = { 'add': list(results.ordered_statistics[i][0].items_add)[0], 'conf': results.ordered_statistics[i][0].confidence }
            if  key not in kv:
                value = [value]
                kv[key] = value
            else:
                kv[key].append(value)
        return kv

    def train(self, transactions):
        rules = apriori(transactions, min_support = 0.01, min_confidence = 0.2, min_lift = 2, min_length = 2)
        results = list(rules)
        results = pd.DataFrame(results)

        self.model = self.transform_results_to_dict(results)

    def get_recommendations(self, items):
        results = []
        for item in items:
            rules = self.model.get(item)
            max_conf = 0
            best_rule = None

            if rules:
                for rule in rules:
                    if rule.get('conf', 0) > max_conf:
                        best_rule = rule
                        max_conf = rule.get('conf')

                results.append(best_rule)

        return results
