/**
 * Mattermost integration for notifications
 * Sends notifications via webhook to #UnlockMyDataActivite
 */

import type { MattermostMessage } from '../validation/types';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_MATTERMOST_WEBHOOK_URL || process.env.MATTERMOST_WEBHOOK_URL;
const CHANNEL = 'UnlockMyDataActivite';

/**
 * Send a message to Mattermost via webhook
 */
export async function notifyMattermost(message: MattermostMessage): Promise<void> {
  if (!WEBHOOK_URL) {
    console.warn('⚠️ MATTERMOST_WEBHOOK_URL not set, skipping notification');
    return;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(
        `❌ Mattermost notification failed: ${response.statusText}`
      );
    } else {
      console.log(
        `✅ Mattermost notification sent to #${CHANNEL}`
      );
    }
  } catch (error) {
    console.error('❌ Mattermost notification error:', error);
  }
}

/**
 * Notify of a new contribution submitted as draft
 */
export async function notifySubmission(
  serviceName: string,
  contributor: string,
  submittedAt: string
): Promise<void> {
  return notifyMattermost({
    text: `📝 New contribution submitted: **${serviceName}**`,
    attachments: [
      {
        color: '#1e90ff',
        title: 'Card in draft',
        text: `A contributor submitted a new card for review`,
        fields: [
          {
            title: 'Service',
            value: serviceName,
            short: true,
          },
          {
            title: 'Contributor',
            value: contributor,
            short: true,
          },
          {
            title: 'Submitted',
            value: new Date(submittedAt).toLocaleString('en-US'),
            short: false,
          },
          {
            title: 'Action required',
            value: 'Moderator review',
            short: false,
          },
        ],
      },
    ],
  });
}

/**
 * Notify that feedback has been added to a card
 */
export async function notifyReview(
  serviceName: string,
  fieldsCount: number,
  reviewer: string,
  reviewedAt: string
): Promise<void> {
  return notifyMattermost({
    text: `🔍 Feedback added to: **${serviceName}**`,
    attachments: [
      {
        color: '#ff8c00',
        title: 'Changes requested',
        text: `A moderator added feedback to this card`,
        fields: [
          {
            title: 'Service',
            value: serviceName,
            short: true,
          },
          {
            title: 'Moderator',
            value: reviewer,
            short: true,
          },
          {
            title: 'Fields to fix',
            value: `${fieldsCount} field(s)`,
            short: true,
          },
          {
            title: 'Added',
            value: new Date(reviewedAt).toLocaleString('en-US'),
            short: true,
          },
          {
            title: 'Status',
            value: 'changes_requested',
            short: false,
          },
          {
            title: 'Action required',
            value: 'Contributor must fix and resubmit',
            short: false,
          },
        ],
      },
    ],
  });
}

/**
 * Notify that a card has been resubmitted after corrections
 */
export async function notifyResubmission(
  serviceName: string,
  contributor: string,
  resubmittedAt: string
): Promise<void> {
  return notifyMattermost({
    text: `♻️ Card resubmitted: **${serviceName}**`,
    attachments: [
      {
        color: '#4169e1',
        title: 'Corrections made',
        text: `Contributor resubmitted the card after corrections`,
        fields: [
          {
            title: 'Service',
            value: serviceName,
            short: true,
          },
          {
            title: 'Contributor',
            value: contributor,
            short: true,
          },
          {
            title: 'Resubmitted',
            value: new Date(resubmittedAt).toLocaleString('en-US'),
            short: false,
          },
          {
            title: 'Action required',
            value: 'New moderator review',
            short: false,
          },
        ],
      },
    ],
  });
}

/**
 * Notify that a card has been approved and published
 */
export async function notifyPublished(
  serviceName: string,
  reviewer: string,
  approvedAt: string
): Promise<void> {
  return notifyMattermost({
    text: `✅ Card published: **${serviceName}**`,
    attachments: [
      {
        color: '#228b22',
        title: 'Publication approved',
        text: `The card is now publicly visible`,
        fields: [
          {
            title: 'Service',
            value: serviceName,
            short: true,
          },
          {
            title: 'Approved by',
            value: reviewer,
            short: true,
          },
          {
            title: 'Published',
            value: new Date(approvedAt).toLocaleString('en-US'),
            short: false,
          },
          {
            title: 'Status',
            value: 'published ✅',
            short: false,
          },
        ],
      },
    ],
  });
}

/**
 * Notify contributors of a validation error
 */
export async function notifyValidationError(
  serviceName: string,
  errors: string[]
): Promise<void> {
  return notifyMattermost({
    text: `⚠️ Validation error: **${serviceName}**`,
    attachments: [
      {
        color: '#dc143c',
        title: 'Card not accepted',
        text: `Validation errors were found`,
        fields: [
          {
            title: 'Service',
            value: serviceName,
            short: false,
          },
          {
            title: 'Errors',
            value: errors.slice(0, 3).join('\n• ') || 'Unknown error',
            short: false,
          },
          {
            title: 'Action required',
            value: 'Fix errors and resubmit',
            short: false,
          },
        ],
      },
    ],
  });
}
