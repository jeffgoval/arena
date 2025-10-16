import { Team } from '../../../types';
import { ITeamRepository } from '../../repositories/teams/ITeamRepository';

export class TeamService {
  constructor(private repository: ITeamRepository) {}

  async getTeam(id: string): Promise<Team | null> {
    return this.repository.getById(id);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.repository.getAll();
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return this.repository.getByOwnerId(userId);
  }

  async getTeamsForMember(userId: string): Promise<Team[]> {
    return this.repository.getByMemberId(userId);
  }

  async searchTeams(query: string): Promise<Team[]> {
    return this.repository.search(query);
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    if (!data.name || !data.sport || !data.ownerId) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(data);
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    const team = await this.repository.getById(id);
    if (!team) throw new Error('Team not found');
    return this.repository.update(id, data);
  }

  async addMemberToTeam(teamId: string, userId: string): Promise<Team> {
    return this.repository.addMember(teamId, userId);
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<Team> {
    return this.repository.removeMember(teamId, userId);
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.repository.getById(id);
    if (!team) throw new Error('Team not found');
    await this.repository.delete(id);
  }
}

