import { ICourtRepository, CourtFilters } from './ICourtRepository';
import { Court } from '../../../types';
import { IStorage } from '../../storage/IStorage';

export class LocalCourtRepository implements ICourtRepository {
  private storage: IStorage;
  private courtsKey = 'courts';

  constructor(storage: IStorage) {
    this.storage = storage;
    this.initializeMockData();
  }

  private initializeMockData(): void {
    if (!this.storage.hasItem(this.courtsKey)) {
      const mockCourts: Court[] = [
        {
          id: 'court_1',
          name: 'Quadra 1 - Society',
          type: 'Futebol Society',
          description: 'Quadra de futebol society com piso de madeira',
          images: [],
          specs: { size: '40x20', floor: 'Madeira', lighting: true, covered: true, capacity: 10 },
          amenities: ['Vestiário', 'Chuveiro', 'Estacionamento'],
          rules: ['Sem chuteiras de metal', 'Máximo 10 jogadores'],
          pricing: { hourly: 150, weekend: 180, recurring: 120 },
          availability: { daysOpen: [1, 2, 3, 4, 5, 6], hoursOpen: { start: '08:00', end: '22:00' } },
          rating: { average: 4.8, count: 45 },
        },
        {
          id: 'court_2',
          name: 'Quadra 2 - Vôlei',
          type: 'Vôlei',
          description: 'Quadra de vôlei com rede profissional',
          images: [],
          specs: { size: '18x9', floor: 'Areia', lighting: true, covered: false, capacity: 12 },
          amenities: ['Vestiário', 'Chuveiro'],
          rules: ['Máximo 12 jogadores', 'Uniforme obrigatório'],
          pricing: { hourly: 100, weekend: 120, recurring: 80 },
          availability: { daysOpen: [1, 2, 3, 4, 5, 6], hoursOpen: { start: '09:00', end: '21:00' } },
          rating: { average: 4.5, count: 32 },
        },
      ];
      this.storage.setItem(this.courtsKey, mockCourts);
    }
  }

  private getCourts(): Court[] {
    return this.storage.getItem<Court[]>(this.courtsKey) || [];
  }

  private saveCourts(courts: Court[]): void {
    this.storage.setItem(this.courtsKey, courts);
  }

  async getById(id: string): Promise<Court | null> {
    return this.getCourts().find(c => c.id === id) || null;
  }

  async getAll(): Promise<Court[]> {
    return this.getCourts();
  }

  async create(data: Partial<Court>): Promise<Court> {
    const courts = this.getCourts();
    const court: Court = {
      id: `court_${Date.now()}`,
      name: data.name!,
      type: data.type!,
      description: data.description || '',
      images: data.images || [],
      specs: data.specs!,
      amenities: data.amenities || [],
      rules: data.rules || [],
      pricing: data.pricing!,
      availability: data.availability!,
      rating: { average: 0, count: 0 },
    };
    courts.push(court);
    this.saveCourts(courts);
    return court;
  }

  async update(id: string, data: Partial<Court>): Promise<Court> {
    const courts = this.getCourts();
    const index = courts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Court not found');
    courts[index] = { ...courts[index], ...data };
    this.saveCourts(courts);
    return courts[index];
  }

  async delete(id: string): Promise<void> {
    this.saveCourts(this.getCourts().filter(c => c.id !== id));
  }

  async exists(id: string): Promise<boolean> {
    return (await this.getById(id)) !== null;
  }

  async count(): Promise<number> {
    return this.getCourts().length;
  }

  async getByFilters(filters: CourtFilters): Promise<Court[]> {
    let courts = this.getCourts();
    if (filters.type) courts = courts.filter(c => c.type === filters.type);
    if (filters.minRating) courts = courts.filter(c => c.rating.average >= filters.minRating!);
    if (filters.hasLighting !== undefined) courts = courts.filter(c => c.specs.lighting === filters.hasLighting);
    if (filters.covered !== undefined) courts = courts.filter(c => c.specs.covered === filters.covered);
    return courts;
  }

  async search(query: string): Promise<Court[]> {
    const q = query.toLowerCase();
    return this.getCourts().filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }

  async getAvailable(date: string): Promise<Court[]> {
    return this.getCourts();
  }

  async updateRating(id: string, rating: number): Promise<Court> {
    const court = await this.getById(id);
    if (!court) throw new Error('Court not found');
    const newAverage = (court.rating.average * court.rating.count + rating) / (court.rating.count + 1);
    return this.update(id, { rating: { average: newAverage, count: court.rating.count + 1 } });
  }
}

