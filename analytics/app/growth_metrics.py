import os
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import data_acquisition


def classifyUsers(flag, df, db):
    users_action = df[df.action != 'no_action'].user
    users_no_action = df[df.action == 'no_action'].user

    # action
    ids = [ObjectId(_id) for _id in list(users_action)]
    result1 = db.users.update_many({ '_id': { '$in': ids } }, { '$set': { 'status': flag, 'isNoAction': False } })

    # no action
    ids = [ObjectId(_id) for _id in list(users_no_action)]
    result2 = db.users.update_many({ '_id': { '$in': ids } }, { '$set': { 'status': flag, 'isNoAction': True } })

    return '{} docs were modified!'.format(result1.modified_count + result2.modified_count)


def reclassifyUserCollection(dfActivities, initDatetime, db, saveClassification=False):
    # get last activity
    dfLastAction = dfActivities.groupby(['user']).apply(lambda x: x.nlargest(1, columns=['datetime']))
    dfLastAction['deltatime'] = (initDatetime - dfLastAction['datetime']).astype('timedelta64[D]')
    dfLastAction['deltatime_m'] = (initDatetime - dfLastAction['datetime']).astype('timedelta64[m]')
    dfLastAction['status'] = ''

    # active users
    active_users = dfLastAction[(dfLastAction.action != 'no_action') & (dfLastAction['deltatime'] <= 7)]

    loyal_promoters = ['5d2c89e514b9f2001dcb059b'] # bistrofogonapanela@gmail.com
    customers = ['5a5940ce225c5ff3cbf572d3'] # boasnovasmercearia@gmail.com

    non_prospects = loyal_promoters + customers

    leads = active_users[~active_users.user.isin(non_prospects)]
    dfLastAction.loc[dfLastAction.user.isin(leads.user), 'status'] = 'leads'
    if saveClassification:
        classifyUsers('leads', leads, db)

    loyal_promoters_df = active_users[active_users.user.isin(loyal_promoters)]

    if loyal_promoters[0] in dfLastAction.user:
        dfLastAction.loc[dfLastAction.user.isin(loyal_promoters_df.user), 'status'] = 'loyal_promoters'

    if saveClassification:
        classifyUsers('loyal_promoters', loyal_promoters_df, db)

    customers_df = active_users[active_users.user.isin(customers)]

    if customers[0] in dfLastAction.user:
        dfLastAction.loc[dfLastAction.user.isin(customers_df.user), 'status'] = 'customers'

    if saveClassification:
        classifyUsers('customers', customers_df, db)

    # Really early users
    early_leads = dfLastAction[(dfLastAction.action == 'no_action') & (dfLastAction['deltatime_m'] < 60)]
    dfLastAction.loc[dfLastAction.user.isin(early_leads.user), 'status'] = 'leads'
    if saveClassification:
        classifyUsers('leads', early_leads, db)

    # CHURN
    '''
        Churn D0 - user did not took any action after 1 hour from signin
        Churn D1 - user did not took any action after 1 day
        Churn D7 - user did not took any action between 2 to 7 days
        Churn D28 - user did not took any action between 7 to 28 days
        Churn D84 - user did not took any action between 28 to 84 days
        Churn D364 - user did not took any action between 84 to 364 days
    '''

    # churn D0
    churn_d0 = dfLastAction[(dfLastAction.action == 'no_action') & (dfLastAction['deltatime_m'] >= 60)]
    dfLastAction.loc[dfLastAction.user.isin(churn_d0.user), 'status'] = 'churn_d0'
    if saveClassification:
        classifyUsers('churn_d0', churn_d0, db)

    # churn D1
    churn_d1 = dfLastAction[(dfLastAction['deltatime'] == 1)]
    dfLastAction.loc[dfLastAction.user.isin(churn_d1.user), 'status'] = 'churn_d1'
    if saveClassification:
        classifyUsers('churn_d1', churn_d1, db)

    #churn D7
    churn_d7 = dfLastAction[(dfLastAction['deltatime'] > 1) & (dfLastAction['deltatime'] <= 7)]
    dfLastAction.loc[dfLastAction.user.isin(churn_d7.user), 'status'] = 'churn_d7'
    if saveClassification:
        classifyUsers('churn_d7', churn_d7, db)

    #churn D28
    churn_d28 = dfLastAction[(dfLastAction['deltatime'] > 7) & (dfLastAction['deltatime'] <= 28)]
    dfLastAction.loc[dfLastAction.user.isin(churn_d28.user), 'status'] = 'churn_d28'
    if saveClassification:
        classifyUsers('churn_d28', churn_d28, db)

    #churn D84
    churn_d84 = dfLastAction[(dfLastAction['deltatime'] > 28) & (dfLastAction['deltatime'] <= 84)]
    dfLastAction.loc[dfLastAction.user.isin(churn_d84.user), 'status'] = 'churn_d84'
    if saveClassification:
        classifyUsers('churn_d84', churn_d84, db)

    #churn D364
    churn_d364 = dfLastAction[(dfLastAction['deltatime'] > 84) & (dfLastAction['deltatime'] <= 364)]
    dfLastAction.loc[dfLastAction.user.isin(churn_d364.user), 'status'] = 'churn_d364'
    if saveClassification:
        classifyUsers('churn_d364', churn_d364, db)

    return dfLastAction


def growth_metrics(dfActivities, db):
    pastActivities, presentActivities = data_acquisition.split(dfActivities, attr='signin_at', attrOut='deltatime')

    df_past = reclassifyUserCollection(pastActivities, initDatetime=(datetime.now() - timedelta(days=28)), db=db)
    df_present = reclassifyUserCollection(presentActivities, initDatetime=datetime.now(), db=db)

    values_present = df_present.status.value_counts()
    values_past = df_past.status.value_counts()

    message = ''
    message = os.linesep + '----- GROWTH METRICS -----' + os.linesep
    for key in values_present.keys():
        if key in values_past and key in values_present:
            diff_rate = data_acquisition.calculate_percent_change(values_past[key], values_present[key])
            message += '{0} - {1} {2} {3:.0%}'.format(key, values_past[key], values_present[key], diff_rate) + os.linesep

    df = reclassifyUserCollection(dfActivities, initDatetime=datetime.now(), db=None)
    values = df.status.value_counts()

    keys = ['leads', 'loyal_promoters', 'customers']
    active = 0
    for key in keys:
        active += values.get(key, 0)

    message += 'ACTIVE USERS: {0}'.format(active) + os.linesep

    return message
