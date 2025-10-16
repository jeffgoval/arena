/**
 * Supabase Court Repository
 * Implementação real de ICourtRepository usando Supabase
 */

import { ICourtRepository, CourtFilters } from './ICourtRepository';
import { Court } from '../../../types';
import { IHttpClient } from '../../http/IHttpClient';

export class SupabaseCourtRepository implements ICourtRepository {
  constructor(private httpClient: IHttpClient) {}

  async getById(id: string): Promise<Court | null> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/courts?id=eq.${id}`
      );
      
      if (response.data && response.data.length > 0) {
        return this.mapToCourt(response.data[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting court:', error);
      return null;
    }
  }

  async getAll(): Promise<Court[]> {
    try {
      const response = await this.httpClient.get<any[]>('/courts');
      return (response.data || []).map(c => this.mapToCourt(c));
    } catch (error) {
      console.error('Error getting all courts:', error);
      return [];
    }
  }

  async create(court: Partial<Court>): Promise<Court> {
    try {
      const response = await this.httpClient.post<any>(
        '/courts',
        this.mapFromCourt(court)
      );
      return this.mapToCourt(response.data[0]);
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  }

  async update(id: string, court: Partial<Court>): Promise<Court> {
    try {
      const response = await this.httpClient.patch<any>(
        `/courts?id=eq.${id}`,
        this.mapFromCourt(court)
      );
      return this.mapToCourt(response.data[0]);
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/courts?id=eq.${id}`);
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  }

  async search(filters: CourtFilters): Promise<Court[]> {
    try {
      let query = '/courts?';
      const params: string[] = [];

      if (filters.type) {
        params.push(`type=eq.${filters.type}`);
      }
      if (filters.city) {
        params.push(`city=eq.${filters.city}`);
      }
      if (filters.minRating) {
        params.push(`rating=gte.${filters.minRating}`);
      }

      query += params.join('&');
      const response = await this.httpClient.get<any[]>(query);
      return (response.data || []).map(c => this.mapToCourt(c));
    } catch (error) {
      console.error('Error searching courts:', error);
      return [];
    }
  }

  async searchByName(name: string): Promise<Court[]> {
    try {
      const response = await this.httpClient.get<any[]>(
        `/courts?name=ilike.%${name}%`
      );
      return (response.data || []).map(c => this.mapToCourt(c));
    } catch (error) {
      console.error('Error searching courts by name:', error);
      return [];
    }
  }

  async filterCourts(filters: CourtFilters): Promise<Court[]> {
    return this.search(filters);
  }

  async getAllCourts(): Promise<Court[]> {
    return this.getAll();
  }

  async getCourt(id: string): Promise<Court | null> {
    return this.getById(id);
  }

  async searchCourts(query: string): Promise<Court[]> {
    return this.searchByName(query);
  }

  private mapToCourt(data: any): Court {
    return {
      id: String(data.id),
      name: data.name,
      type: data.type,
      description: data.description,
      images: data.images || [],
      specs: data.specs || {},
      amenities: data.amenities || [],
      rules: data.rules || [],
      pricing: data.pricing || {},
      availability: data.availability || {},
      rating: {
        average: data.rating || 0,
        count: data.review_count || 0,
      },
    };
  }

  private mapFromCourt(court: Partial<Court>): any {
    return {
      name: court.name,
      type: court.type,
      description: court.description,
      images: court.images,
      specs: court.specs,
      amenities: court.amenities,
      rules: court.rules,
      pricing: court.pricing,
      availability: court.availability,
    };
  }
}

