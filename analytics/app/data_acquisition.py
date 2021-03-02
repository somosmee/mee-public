import pandas as pd
from datetime import datetime


def getRetentionDay(user, date):
    signupDate = user.get('createdAt').date()
    return (date.date() - signupDate).days


def getActivitiesDF(user, db):
    data = []
    # orders
    orders = list(db.orders.find(
        {'grocery': user.get('_id')},
        {'createdAt': 1}
    ))
    for order in orders:
        data.append({
            'user': str(user.get('_id')),
            'action': 'create_order',
            'day': getRetentionDay(user, order.get('createdAt')),
            'datetime': order.get('createdAt'),
            'signin_at': user.get('createdAt')
        })

    # products
    products = list(db.usersProducts.find({
        'grocery': user.get('_id')},
        {'createdAt': 1}
    ))
    for product in products:
        data.append({
            'user': str(user.get('_id')),
            'action': 'create_product',
            'day': getRetentionDay(user, product.get('createdAt')),
            'datetime': product.get('createdAt'),
            'signin_at': user.get('createdAt')
        })

    # purchases
    purchases = list(db.purchases.find({
        'grocery': user.get('_id')},
        {'createdAt': 1}
    ))
    for purchase in purchases:
        data.append({
            'user': str(user.get('_id')),
            'action': 'create_purchase',
            'day': getRetentionDay(user, purchase.get('createdAt')),
            'datetime': purchase.get('createdAt'),
            'signin_at': user.get('createdAt')
        })
    # customers
    customers = list(db.customers.find(
        {'grocery': user.get('_id')},
        {'createdAt': 1}))
    for customer in customers:
        data.append({
            'user': str(user.get('_id')),
            'action': 'create_customer',
            'day': getRetentionDay(user, customer.get('createdAt')),
            'datetime': customer.get('createdAt'),
            'signin_at': user.get('createdAt')
        })
    # suppliers
    suppliers = list(db.suppliers.find(
        {'grocery': user.get('_id')},
        {'createdAt': 1}
    ))
    for supplier in suppliers:
        data.append({
            'user': str(user.get('_id')),
            'action': 'create_supplier',
            'day': getRetentionDay(user, supplier.get('createdAt')),
            'datetime': supplier.get('createdAt'),
            'signin_at': user.get('createdAt')
        })
    # financial statements
    financialStatements = list(db.financialStatements.find(
        {
            'grocery': user.get('_id'),
            'order': {'$exists': False},
            'purchase': {'$exists': False}
        },
        {'createdAt': 1}
    ))
    for financialStatement in financialStatements:
        data.append({
            'user': str(user.get('_id')),
            'action': 'create_financial_statement',
            'day': getRetentionDay(user, financialStatement.get('createdAt')),
            'datetime': financialStatement.get('createdAt'),
            'signin_at': user.get('createdAt')
        })

    if len(data) == 0:
        data.append({
            'user': str(user.get('_id')),
            'action': 'no_action',
            'day': 0,
            'datetime': user.get('createdAt'),
            'signin_at': user.get('createdAt')
        })
    return data


def getUsersActivities(users, db):
    activities = []
    for user in users:
        userActivities = getActivitiesDF(user, db)
        activities.extend(userActivities)
    dfActivities = pd.DataFrame(activities)
    return dfActivities


# split between a fixed time frame
def split(df, attr, attrOut='deltatime', timeframe=28):
    df[attrOut] = (datetime.now() - df[attr]).astype('timedelta64[D]')

    present = df[(df[attrOut] >= 0) & (df[attrOut] <= 28)]
    past = df[(df[attrOut] > 28) & (df[attrOut] <= 56)]

    return past, present


def calculate_percent_change(old, new):
    if old == 0:
        return 0

    percent = (new / old) - 1
    return percent
