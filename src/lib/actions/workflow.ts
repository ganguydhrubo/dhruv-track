export type ActionStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'CLOSED' | 'REOPENED';

export const VALID_TRANSITIONS: Record<ActionStatus, ActionStatus[]> = {
  OPEN: ['ASSIGNED'],
  ASSIGNED: ['IN_PROGRESS', 'OPEN'],
  IN_PROGRESS: ['PENDING_VERIFICATION', 'ASSIGNED'],
  PENDING_VERIFICATION: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['ASSIGNED']
};

export function validateTransition(currentStatus: ActionStatus, nextStatus: ActionStatus): boolean {
  return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

export function getAvailableTransitions(currentStatus: ActionStatus, role: string): ActionStatus[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}
