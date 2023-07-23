export interface VotingResult {
  electionName: string;
  partyAbbreviation: string;
  nominationName: string;
  votesOnNomination: number;
  votesThroughHealing: number;
  votesPerPosition: {[name: string]: number};
}
