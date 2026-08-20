export type MatchesQuery = {
  playerName?: string;
  date?: Date;
};

export const matchesQuerySchema = {
  type: 'object',
  properties: {
    playerName: { type: 'string' },
    date: { type: 'string', format: 'date' },
  },
  additionalProperties: false,
};
