export const accountCreatedState = { accountCreated: true}

export const isAccountCreatedState = (state: unknown): boolean => {
    return typeof state === 'object' &&
    state !== null &&
    'accountCreated' in state &&
    state.accountCreated === true
}