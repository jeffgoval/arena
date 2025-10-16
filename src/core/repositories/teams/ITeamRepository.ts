import { IRepository } from '../IRepository';
import { Team } from '../../../types';

export interface ITeamRepository extends IRepository<Team> {
  getByOwnerId(ownerId: string): Promise<Team[]>;
  getByMemberId(memberId: string): Promise<Team[]>;
  addMember(teamId: string, userId: string): Promise<Team>;
  removeMember(teamId: string, userId: string): Promise<Team>;
  search(query: string): Promise<Team[]>;
}

