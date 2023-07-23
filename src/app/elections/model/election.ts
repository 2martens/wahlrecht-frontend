import {VotingThreshold} from "./voting-threshold";
import {Constituency} from "./constituency";

export interface Election {
  name: string;
  day: string;
  totalNumberOfSeats: number;
  votingThreshold: VotingThreshold;
  constituencies: Constituency[];
}

export const DEFAULT_ELECTION: Election = {
  name: "",
  day: "",
  totalNumberOfSeats: 0,
  votingThreshold: VotingThreshold.NONE,
  constituencies: []
}
