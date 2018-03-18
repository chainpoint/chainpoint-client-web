import chainpoint from 'chainpoint-client/dist/bundle.web';

export const submitHash = hash => chainpoint.submitHashes([hash]);
