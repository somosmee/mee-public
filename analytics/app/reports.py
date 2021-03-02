import pandas as pd
import data_acquisition
import acquisition_metrics
import engagements_metrics
import growth_metrics
import retention_metrics
from datetime import datetime


def get_reports(db):
    users = list(db.users.find().sort('createdAt', -1))
    dfUsers = pd.DataFrame(users).fillna(0)
    dfActivities = data_acquisition.getUsersActivities(users, db)

    message = ''
    message += acquisition_metrics.acquisition_pipeline_metrics(dfUsers, dfActivities)
    message += engagements_metrics.engagement_metrics(dfActivities)
    message += growth_metrics.growth_metrics(dfActivities, db)
    message += retention_metrics.retention_metrics(dfActivities)

    return message


def reclassify(db):
    users = list(db.users.find().sort('createdAt', -1))
    dfActivities = data_acquisition.getUsersActivities(users, db)

    growth_metrics.reclassifyUserCollection(
        dfActivities,
        initDatetime=datetime.now(),
        db=db,
        saveClassification=True
    )
