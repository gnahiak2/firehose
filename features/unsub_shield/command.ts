import type { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { logInternal, postEphemeral } from '../../utils/index.js';
import { isUnsubOptedOut, setUnsubOptOut, toggleUnsubOptOut } from './api.js';

export default async function unsubOptOutCommand({
    payload: { user_id, channel_id, text },
    ack,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs): Promise<void> {
    await ack();

    const action = text.split(' ').filter(Boolean)[0]?.toLowerCase();

    if (action === 'status') {
        const optedOut = await isUnsubOptedOut(user_id);
        await postEphemeral(
            channel_id,
            user_id,
            optedOut
                ? "_You're opted out — your UNSUBSCRIBE thread replies are left alone._"
                : "_You're not opted out — your UNSUBSCRIBE thread replies get deleted._"
        );
        return;
    }

    let optedOut: boolean;
    if (action === 'on') optedOut = await setUnsubOptOut(user_id, true);
    else if (action === 'off') optedOut = await setUnsubOptOut(user_id, false);
    else optedOut = await toggleUnsubOptOut(user_id);

    await Promise.all([
        postEphemeral(
            channel_id,
            user_id,
            optedOut
                ? "_You're opted out now — your UNSUBSCRIBE thread replies won't be deleted._"
                : "_You're opted back in — your UNSUBSCRIBE thread replies will be deleted again._"
        ),
        logInternal(`<@${user_id}> ${optedOut ? 'opted out of' : 'opted back into'} unsub_shield`),
    ]);
}
