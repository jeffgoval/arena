import { IRepository } from '../IRepository';
import { Court } from '../../../types';

export interface CourtFilters {
  type?: string;
  minRating?: number;
  hasLighting?: boolean;
  covered?: boolean;
}

export interface ICourtRepository extends IRepository<Court> {
  getByFilters(filters: CourtFilters): Promise<Court[]>;
  search(query: string): Promise<Court[]>;
  getAvailable(date: string): Promise<Court[]>;
  updateRating(id: string, rating: number): Promise<Court>;
}

