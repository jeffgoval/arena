/**
 * Supabase Team Repository
 * Implementação real de ITeamRepository usando Supabase
 */

import { ITeamRepository } from './ITeamRepository';
import { Team, TeamMember } from '../../../types';
import { IHttpClient } from '../../http/IHttpClient';

export class SupabaseTeamRepository implements ITeamRepository {
  constructor(private httpClient: IHttpClient) {}

  async getById(id: string): Promise<Team | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/teams?id=eq.${id}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToTeam(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting team:', error);
      return null;
    }
  }

  async getAll(): Promise<Team[]> {
    try {
      const response = await this.httpClient.get<any[]>('/teams');
      return (response.data || []).map(t => this.mapToTeam(t));
    } catch (error) {
      console.error('Error getting all teams:', error);
      return [];
    }
  }

  async create(team: Partial<Team>): Promise<Team> {
    try {
      const response = await this.httpClient.post<any>(
        '/teams',
        this.mapFromTeam(team)
      );
      return this.mapToTeam(response.data[0]);
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async update(id: string, team: Partial<Team>): Promise<Team> {
    try {
      const response = await this.httpClient.patch<any>(
        `/teams?id=eq.${id}`,
        this.mapFromTeam(team)
      );
      return this.mapToTeam(response.data[0]);
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/teams?id=eq.${id}`);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/teams?owner_id=eq.${userId}`
      );
      return (response.data || []).map(t => this.mapToTeam(t));
    } catch (error) {
      console.error('Error getting user teams:', error);
      return [];
    }
  }

  async getTeamsForMember(userId: string): Promise<Team[]> {
    try {
      const response = await this.httpClient.get<any[]>('/teams');
      return (response.data || [])
        .filter(t => {
          const members = t.members || [];
          return members.includes(userId);
        })
        .map(t => this.mapToTeam(t));
    } catch (error) {
      console.error('Error getting teams for member:', error);
      return [];
    }
  }

  async searchTeams(query: string): Promise<Team[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/teams?name=ilike.%${query}%`
      );
      return (response.data || []).map(t => this.mapToTeam(t));
    } catch (error) {
      console.error('Error searching teams:', error);
      return [];
    }
  }

  async addMember(teamId: string, memberId: string): Promise<void> {
    try {
      const team = await this.getById(teamId);
      if (team) {
        const members = team.members || [];
        if (!members.includes(memberId)) {
          members.push(memberId);
          await this.update(teamId, { members });
        }
      }
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    try {
      const team = await this.getById(teamId);
      if (team) {
        const members = (team.members || []).filter(m => m !== memberId);
        await this.update(teamId, { members });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  private mapToTeam(data: any): Team {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      members: data.members || [],
      maxMembers: data.max_members || 12,
      sport: data.sport,
      createdAt: new Date(data.created_at),
    };
  }

  private mapFromTeam(team: Partial<Team>): any {
    return {
      name: team.name,
      description: team.description,
      sport: team.sport,
      owner_id: team.ownerId,
      members: team.members,
      max_members: team.maxMembers,
      is_private: team.isPrivate,
      avatar_url: team.avatar,
    };
  }
}

