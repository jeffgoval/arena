import { ITeamRepository } from './ITeamRepository';
import { Team, TeamMember } from '../../../types';
import { IStorage } from '../../storage/IStorage';

export class LocalTeamRepository implements ITeamRepository {
  private storage: IStorage;
  private teamsKey = 'teams';

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  private getTeams(): Team[] {
    return this.storage.getItem<Team[]>(this.teamsKey) || [];
  }

  private saveTeams(teams: Team[]): void {
    this.storage.setItem(this.teamsKey, teams);
  }

  async getById(id: string): Promise<Team | null> {
    return this.getTeams().find(t => t.id === id) || null;
  }

  async getAll(): Promise<Team[]> {
    return this.getTeams();
  }

  async create(data: Partial<Team>): Promise<Team> {
    const teams = this.getTeams();
    const team: Team = {
      id: `team_${Date.now()}`,
      name: data.name!,
      description: data.description || '',
      sport: data.sport!,
      avatar: data.avatar,
      ownerId: data.ownerId!,
      members: data.members || [],
      maxMembers: data.maxMembers || 20,
      isPrivate: data.isPrivate || false,
      createdAt: new Date(),
      stats: { gamesPlayed: 0, nextGame: undefined },
    };
    teams.push(team);
    this.saveTeams(teams);
    return team;
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    const teams = this.getTeams();
    const index = teams.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Team not found');
    teams[index] = { ...teams[index], ...data };
    this.saveTeams(teams);
    return teams[index];
  }

  async delete(id: string): Promise<void> {
    this.saveTeams(this.getTeams().filter(t => t.id !== id));
  }

  async exists(id: string): Promise<boolean> {
    return (await this.getById(id)) !== null;
  }

  async count(): Promise<number> {
    return this.getTeams().length;
  }

  async getByOwnerId(ownerId: string): Promise<Team[]> {
    return this.getTeams().filter(t => t.ownerId === ownerId);
  }

  async getByMemberId(memberId: string): Promise<Team[]> {
    return this.getTeams().filter(t => t.members.some(m => m.userId === memberId));
  }

  async addMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.getById(teamId);
    if (!team) throw new Error('Team not found');
    if (team.members.length >= team.maxMembers) throw new Error('Team is full');
    
    const newMember: TeamMember = {
      userId,
      name: `User ${userId}`,
      role: 'member',
      joinedAt: new Date(),
      stats: { gamesPlayed: 0, attendance: 0 },
    };
    
    return this.update(teamId, { members: [...team.members, newMember] });
  }

  async removeMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.getById(teamId);
    if (!team) throw new Error('Team not found');
    
    return this.update(teamId, {
      members: team.members.filter(m => m.userId !== userId),
    });
  }

  async search(query: string): Promise<Team[]> {
    const q = query.toLowerCase();
    return this.getTeams().filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }
}

