import os
import data_acquisition


def email_signup_rate(df):
    return df[df.pin == 0].shape[0] / df.shape[0]


def no_action_rate(df):
    return df[df['action'] == 'no_action'].shape[0] / df.shape[0]


def activitiy_rate(df, users, activity):
    df = df[df.action == activity].groupby(['user']).count()
    return df.shape[0] / len(users)


def calculate_activity_rates(pastActivities, pastUsers, presentActivities, presentUsers, activity):
    rate_past = activitiy_rate(pastActivities, pastUsers, activity=activity)
    rate_present = activitiy_rate(presentActivities, presentUsers, activity=activity)
    diff_rate = rate_present - rate_past

    return rate_present, diff_rate


def acquisition_pipeline_metrics(dfUsers, dfActivities):
    pastUsers, presentUsers = data_acquisition.split(dfUsers, attr='createdAt', attrOut='deltatime')
    pastActivities, presentActivities = data_acquisition.split(dfActivities, attr='signin_at', attrOut='deltatime')


    message = ''

    message += os.linesep + '------ SIGNIN ---- ' + os.linesep

    signup_trigger_rate_past = email_signup_rate(pastUsers)
    signup_trigger_rate_present = email_signup_rate(presentUsers)
    diff_rate = signup_trigger_rate_present - signup_trigger_rate_past

    message += '{0:.0%} of the users who triggered the pin actually signed up'.format(signup_trigger_rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep

    message += os.linesep + '------ ONBOARDING ----' + os.linesep

    # Rate no action / signup
    no_action_rate_past = no_action_rate(pastActivities)
    no_action_rate_present = no_action_rate(presentActivities)
    diff_rate = no_action_rate_present - no_action_rate_past

    message += '{0:.0%} of the users signin in the platform and dont perform any action'.format(no_action_rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep


    # Rate create_product / signup
    rate_present, diff_rate = calculate_activity_rates(pastActivities, pastUsers, presentActivities, presentUsers, 'create_product')

    message += os.linesep + '{0:.0%} of the users signin in the platform create products'.format(rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep

    # Rate create_order / signup
    rate_present, diff_rate = calculate_activity_rates(pastActivities, pastUsers, presentActivities, presentUsers, 'create_order')

    message += os.linesep + '{0:.0%} of the users signin in the platform create orders'.format(rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep

    # Rate create_supplier / signup
    rate_present, diff_rate = calculate_activity_rates(pastActivities, pastUsers, presentActivities, presentUsers, 'create_supplier')

    message += os.linesep + '{0:.0%} of the users signin in the platform create supplier'.format(rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep

    # Rate create_purchase / signup
    rate_present, diff_rate = calculate_activity_rates(pastActivities, pastUsers, presentActivities, presentUsers, 'create_purchase')

    message += os.linesep + '{0:.0%} of the users signin in the platform create purchase'.format(rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep

    # Rate create_customer / signup
    rate_present, diff_rate = calculate_activity_rates(pastActivities, pastUsers, presentActivities, presentUsers, 'create_customer')

    message += os.linesep + '{0:.0%} of the users signin in the platform create customer'.format(rate_present) + os.linesep
    message += '{0:.0%} diff from past 28 days'.format(diff_rate) + os.linesep

    return message
