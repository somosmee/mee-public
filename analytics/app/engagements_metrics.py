import os
import data_acquisition


def last_action_deltatime_mean(df):
    dfLastAction = df.groupby(['user']).apply(lambda x: x.nlargest(1, columns=['datetime']))
    dfLastAction['deltatime_last_activity'] = (dfLastAction['datetime'] - dfLastAction['signin_at']).astype('timedelta64[m]')
    return dfLastAction[(dfLastAction.deltatime_last_activity < 50) & (dfLastAction.deltatime_last_activity > 0)].deltatime_last_activity.describe()['mean']


def engagement_metrics(dfActivities):
    message = ''

    # Engagement
    # time interval from signin and last action for users who did some activity
    pastActivities, presentActivities = data_acquisition.split(dfActivities, attr='signin_at', attrOut='deltatime')

    mean_past = last_action_deltatime_mean(pastActivities)
    mean_present = last_action_deltatime_mean(presentActivities)
    diff_rate = data_acquisition.calculate_percent_change(mean_past, mean_present)


    message += os.linesep + '------ ENGAGEMENT ----' + os.linesep
    message += '{} mean in minutes that new users stay in the platform'.format(mean_present)  + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate)  + os.linesep
    return message
