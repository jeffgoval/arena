import { TeamService } from '../TeamService';
import { LocalTeamRepository } from '../../repositories/teams/LocalTeamRepository';
import { LocalStorage } from '../../storage/LocalStorage';
import { Team } from '../../../types';

describe('TeamService', () => {
  let teamService: TeamService;
  let teamRepository: LocalTeamRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('test_');
    teamRepository = new LocalTeamRepository(storage);
    teamService = new TeamService(teamRepository);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('createTeam', () => {
    it('should create a team successfully', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        sport: 'Futebol',
        ownerId: 'user_1',
      };

      const team = await teamService.createTeam(teamData);
      expect(team).toBeDefined();
      expect(team.name).toBe('Team A');
      expect(team.ownerId).toBe('user_1');
    });

    it('should throw error when missing required fields', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        // Missing sport and ownerId
      };

      await expect(teamService.createTeam(teamData)).rejects.toThrow();
    });
  });

  describe('getUserTeams', () => {
    it('should return teams owned by user', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        sport: 'Futebol',
        ownerId: 'user_1',
      };

      await teamService.createTeam(teamData);
      const teams = await teamService.getUserTeams('user_1');
      expect(teams).toHaveLength(1);
      expect(teams[0].ownerId).toBe('user_1');
    });
  });

  describe('addMemberToTeam', () => {
    it('should add member to team', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        sport: 'Futebol',
        ownerId: 'user_1',
      };

      const team = await teamService.createTeam(teamData);
      const updated = await teamService.addMemberToTeam(team.id, 'user_2');
      expect(updated.members).toHaveLength(1);
      expect(updated.members[0].userId).toBe('user_2');
    });

    it('should throw error when team is full', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        sport: 'Futebol',
        ownerId: 'user_1',
        maxMembers: 1,
      };

      const team = await teamService.createTeam(teamData);
      await teamService.addMemberToTeam(team.id, 'user_2');
      
      await expect(
        teamService.addMemberToTeam(team.id, 'user_3')
      ).rejects.toThrow('Team is full');
    });
  });

  describe('removeMemberFromTeam', () => {
    it('should remove member from team', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        sport: 'Futebol',
        ownerId: 'user_1',
      };

      const team = await teamService.createTeam(teamData);
      await teamService.addMemberToTeam(team.id, 'user_2');
      const updated = await teamService.removeMemberFromTeam(team.id, 'user_2');
      expect(updated.members).toHaveLength(0);
    });
  });

  describe('searchTeams', () => {
    it('should search teams by name', async () => {
      const teamData: Partial<Team> = {
        name: 'Team A',
        sport: 'Futebol',
        ownerId: 'user_1',
      };

      await teamService.createTeam(teamData);
      const results = await teamService.searchTeams('Team');
      expect(results).toHaveLength(1);
    });
  });
});

