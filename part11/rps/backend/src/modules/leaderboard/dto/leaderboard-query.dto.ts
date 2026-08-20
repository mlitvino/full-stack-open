export type LeaderboardQuery = {
  from: Date;
  to: Date;
};

export const leaderboardQuerySchema = {
  type: 'object',
  properties: {
    date: { type: 'string', format: 'date' },
    from: { type: 'string', format: 'date' },
    to: { type: 'string', format: 'date' },
  },
  oneOf: [
    { required: ['date'] },
    { required: ['from', 'to'] },
  ],
} as const;
