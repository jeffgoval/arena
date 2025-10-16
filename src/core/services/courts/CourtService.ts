import { Court } from '../../../types';
import { ICourtRepository, CourtFilters } from '../../repositories/courts/ICourtRepository';

export class CourtService {
  constructor(private repository: ICourtRepository) {}

  async getCourt(id: string): Promise<Court | null> {
    return this.repository.getById(id);
  }

  async getAllCourts(): Promise<Court[]> {
    return this.repository.getAll();
  }

  async searchCourts(query: string): Promise<Court[]> {
    return this.repository.search(query);
  }

  async filterCourts(filters: CourtFilters): Promise<Court[]> {
    return this.repository.getByFilters(filters);
  }

  async getAvailableCourts(date: string): Promise<Court[]> {
    return this.repository.getAvailable(date);
  }

  async createCourt(data: Partial<Court>): Promise<Court> {
    if (!data.name || !data.type || !data.specs || !data.pricing || !data.availability) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(data);
  }

  async updateCourt(id: string, data: Partial<Court>): Promise<Court> {
    const court = await this.repository.getById(id);
    if (!court) throw new Error('Court not found');
    return this.repository.update(id, data);
  }

  async rateCourt(id: string, rating: number): Promise<Court> {
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
    return this.repository.updateRating(id, rating);
  }

  async deleteCourt(id: string): Promise<void> {
    const court = await this.repository.getById(id);
    if (!court) throw new Error('Court not found');
    await this.repository.delete(id);
  }
}

