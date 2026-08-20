import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import type { Move } from '../types/legacy-api.type.js';
import type { Winner } from '../types/matches.type.js';

function bigIntTransformer() {
  return {
    from: (value: string | null): number | null => (value === null ? null : Number(value)),
    to: (value: number | null): string | null => (value === null ? null : String(value)),
  };
}

@Entity({ name: 'matches' })
@Index('idx_matches_day_time', ['startOfDayMs', 'playedAtMs'])
@Index('idx_matches_player_a_day', ['playerAName', 'startOfDayMs'])
@Index('idx_matches_player_b_day', ['playerBName', 'startOfDayMs'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ name: 'game_id', type: 'text', unique: true })
    gameId!: string;

  @Column({ name: 'played_at_ms', type: 'bigint', transformer: bigIntTransformer() })
    playedAtMs!: number;

  @Column({ name: 'start_of_day_ms', type: 'bigint', transformer: bigIntTransformer() })
    startOfDayMs!: number;

  @Column({ name: 'player_a_name', type: 'text' })
    playerAName!: string;

  @Column({ name: 'player_b_name', type: 'text' })
    playerBName!: string;

  @Column({
    name: 'player_a_move',
    type: 'text',
    enum: ['ROCK', 'PAPER', 'SCISSORS'],
  })
    playerAMove!: Move;

  @Column({
    name: 'player_b_move',
    type: 'text',
    enum: ['ROCK', 'PAPER', 'SCISSORS'],
  })
    playerBMove!: Move;

  @Column({
    name: 'winner',
    type: 'text',
    enum: ['PlayerA', 'PlayerB', 'Tie'],
  })
    winner!: Winner;
}
