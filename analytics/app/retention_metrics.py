import os
import data_acquisition


def retention_rate(d1, d2):
    if d2 == 0:
        return 0
    return d1/d2


def calc_d_metrics(df):
    d0 = df.groupby(['user']).count().shape[0]
    d1 = df[df['day'] == 1].groupby(['user']).count().shape[0]
    d7 = df[(df['day'] > 1) & (df['day'] <= 7)].groupby(['user']).count().shape[0]
    d28 = df[(df['day'] > 7) & (df['day'] <= 28)].groupby(['user']).count().shape[0]
    d84 = df[(df['day'] > 28) & (df['day'] <= 84)].groupby(['user']).count().shape[0]
    d364 = df[(df['day'] > 84) & (df['day'] <= 364)].groupby(['user']).count().shape[0]

    return d0, d1, d7, d28, d84, d364


def calc_d364(d0, d1_d0_rate, d7_d1_rate, d28_d7_rate, d84_d28_rate, d364_d84_rate):
    return d0 * d1_d0_rate * d7_d1_rate * d28_d7_rate * d84_d28_rate * d364_d84_rate


def retention_metrics(activities):
    pastActivities, presentActivities = data_acquisition.split(activities, attr='signin_at', attrOut='deltatime')

    d0_present, d1_present, d7_present, d28_present, d84_present, d364_present = calc_d_metrics(presentActivities)

    d1_d0_rate = retention_rate(d1_present, d0_present)
    d7_d1_rate = retention_rate(d7_present, d1_present)
    d28_d7_rate = retention_rate(d28_present, d7_present)
    d84_d28_rate = retention_rate(d84_present, d28_present)
    d364_d84_rate = retention_rate(d364_present, d84_present)

    d0_past, d1_past, d7_past, d28_past, d84_past, d364_past = calc_d_metrics(pastActivities)

    diff_rate_d0 = data_acquisition.calculate_percent_change(d0_past, d0_present)
    diff_rate_d1 = data_acquisition.calculate_percent_change(d1_past, d1_present)
    diff_rate_d7 = data_acquisition.calculate_percent_change(d7_past, d7_present)
    diff_rate_d28 = data_acquisition.calculate_percent_change(d28_past, d28_present)

    d0_all, d1_all, d7_all, d28_all, d84_all, d364_all = calc_d_metrics(activities)
    d1_d0_rate_all = retention_rate(d1_all, d0_all)
    d7_d1_rate_all = retention_rate(d7_all, d1_all)
    d28_d7_rate_all = retention_rate(d28_all, d7_all)
    d84_d28_rate_all = retention_rate(d84_all, d28_all)
    d364_d84_rate_all = retention_rate(d364_all, d84_all)

    d364_rate = calc_d364(d0_all, d1_d0_rate_all, d7_d1_rate_all, d28_d7_rate_all, d84_d28_rate_all, d364_d84_rate_all)

    message = os.linesep + '------ RETENTION ----' + os.linesep
    message += 'd0: {0} {1} {2:.0%}'.format(d0_past, d0_present, diff_rate_d0) + os.linesep
    message += 'd1: {0} {1} {2:.0%}'.format(d1_past, d1_present, diff_rate_d1) + os.linesep
    message += 'd7: {0} {1} {2:.0%}'.format(d7_past, d7_present, diff_rate_d7) + os.linesep
    message += 'd28: {0} {1} {2:.0%}'.format(d28_past, d28_present, diff_rate_d28) + os.linesep

    message += os.linesep + 'd1/d0: {}'.format(d1_d0_rate) + os.linesep
    message += 'd7/d1: {}'.format(d7_d1_rate) + os.linesep
    message += 'd28/d7: {}'.format(d28_d7_rate) + os.linesep
    message += 'd84/d28: {}'.format(d84_d28_rate) + os.linesep
    message += 'd364/d84: {}'.format(d364_d84_rate) + os.linesep

    message += os.linesep + 'd364 = D0 * (D1/D0) * (D7/D1) * (D28/D7) * (D84/D28) * (D364/D84): {}'.format(d364_rate) + os.linesep
    message += 'd364 = {} * ({}) * ({}) * ({}) * ({}) * ({}): {}'.format(d0_all, d1_d0_rate_all, d7_d1_rate_all, d28_d7_rate_all, d84_d28_rate_all, d364_d84_rate_all, d364_rate) + os.linesep
    return message
