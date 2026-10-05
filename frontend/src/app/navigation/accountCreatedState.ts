export const accountCreatedState = { accountCreated: true}

export const isAccountCreatedSatate = (state: unknown): boolean => {
    return typeof state === 'object' &&
    state !== null &&
    'accountCreated' in state &&
    state.accountCreated === true
}