# Criando Novos Repositórios

## 📋 Passo a Passo

### 1. Definir a Interface

```typescript
// src/core/repositories/bookings/IBookingRepository.ts
import { IRepository } from '../IRepository';
import { Booking } from '../../../types';

export interface BookingFilters {
  userId?: string;
  courtId?: string;
  status?: Booking['status'];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IBookingRepository extends IRepository<Booking> {
  /**
   * Obtém bookings com filtros
   */
  getByFilters(filters: BookingFilters): Promise<Booking[]>;

  /**
   * Obtém bookings do usuário
   */
  getByUserId(userId: string): Promise<Booking[]>;

  /**
   * Obtém bookings da quadra
   */
  getByCourtId(courtId: string): Promise<Booking[]>;

  /**
   * Cancela um booking
   */
  cancel(id: string, reason?: string): Promise<void>;

  /**
   * Confirma um booking
   */
  confirm(id: string): Promise<Booking>;
}
```

### 2. Implementar Repositório Local

```typescript
// src/core/repositories/bookings/LocalBookingRepository.ts
import { IBookingRepository, BookingFilters } from './IBookingRepository';
import { Booking } from '../../../types';
import { IStorage } from '../../storage/IStorage';

export class LocalBookingRepository implements IBookingRepository {
  private storage: IStorage;
  private bookingsKey = 'bookings';

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  private getBookings(): Booking[] {
    return this.storage.getItem<Booking[]>(this.bookingsKey) || [];
  }

  private saveBookings(bookings: Booking[]): void {
    this.storage.setItem(this.bookingsKey, bookings);
  }

  async getById(id: string): Promise<Booking | null> {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === id) || null;
  }

  async getAll(filters?: Record<string, any>): Promise<Booking[]> {
    let bookings = this.getBookings();
    
    if (filters?.userId) {
      bookings = bookings.filter(b => b.userId === filters.userId);
    }
    if (filters?.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }
    
    return bookings;
  }

  async create(data: Partial<Booking>): Promise<Booking> {
    const bookings = this.getBookings();
    const booking: Booking = {
      id: `booking_${Date.now()}`,
      courtId: data.courtId!,
      userId: data.userId!,
      date: data.date!,
      time: data.time!,
      duration: data.duration || 1,
      type: data.type || 'avulsa',
      status: 'pending',
      price: data.price || 0,
      createdAt: new Date(),
      ...data,
    };
    
    bookings.push(booking);
    this.saveBookings(bookings);
    return booking;
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    bookings[index] = { ...bookings[index], ...data };
    this.saveBookings(bookings);
    return bookings[index];
  }

  async delete(id: string): Promise<void> {
    const bookings = this.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    this.saveBookings(filtered);
  }

  async exists(id: string): Promise<boolean> {
    return (await this.getById(id)) !== null;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    const bookings = await this.getAll(filters);
    return bookings.length;
  }

  async getByFilters(filters: BookingFilters): Promise<Booking[]> {
    let bookings = this.getBookings();
    
    if (filters.userId) {
      bookings = bookings.filter(b => b.userId === filters.userId);
    }
    if (filters.courtId) {
      bookings = bookings.filter(b => b.courtId === filters.courtId);
    }
    if (filters.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }
    if (filters.dateFrom) {
      bookings = bookings.filter(b => new Date(b.date) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      bookings = bookings.filter(b => new Date(b.date) <= filters.dateTo!);
    }
    
    return bookings;
  }

  async getByUserId(userId: string): Promise<Booking[]> {
    return this.getByFilters({ userId });
  }

  async getByCourtId(courtId: string): Promise<Booking[]> {
    return this.getByFilters({ courtId });
  }

  async cancel(id: string, reason?: string): Promise<void> {
    await this.update(id, { status: 'canceled' });
  }

  async confirm(id: string): Promise<Booking> {
    return this.update(id, { status: 'confirmed' });
  }
}
```

### 3. Criar o Service

```typescript
// src/core/services/bookings/BookingService.ts
import { Booking } from '../../../types';
import { IBookingRepository, BookingFilters } from '../../repositories/bookings/IBookingRepository';

export class BookingService {
  constructor(private repository: IBookingRepository) {}

  async getBooking(id: string): Promise<Booking | null> {
    return this.repository.getById(id);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.repository.getByUserId(userId);
  }

  async getCourtBookings(courtId: string): Promise<Booking[]> {
    return this.repository.getByCourtId(courtId);
  }

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    // Validações de negócio
    if (!data.courtId || !data.userId || !data.date || !data.time) {
      throw new Error('Missing required fields');
    }

    return this.repository.create(data);
  }

  async cancelBooking(id: string, reason?: string): Promise<void> {
    const booking = await this.repository.getById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel completed booking');
    }

    await this.repository.cancel(id, reason);
  }

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.repository.getById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return this.repository.confirm(id);
  }

  async searchBookings(filters: BookingFilters): Promise<Booking[]> {
    return this.repository.getByFilters(filters);
  }
}
```

### 4. Registrar no ServiceContainer

```typescript
// src/core/config/ServiceContainer.ts
import { BookingService } from '../services/bookings/BookingService';
import { LocalBookingRepository } from '../repositories/bookings/LocalBookingRepository';

export class ServiceContainer {
  private bookingRepository: IBookingRepository;
  private bookingService: BookingService;

  private constructor() {
    // ... código anterior

    // Inicializar Booking
    this.bookingRepository = new LocalBookingRepository(this.storage);
    this.bookingService = new BookingService(this.bookingRepository);
  }

  getBookingService(): BookingService {
    return this.bookingService;
  }
}
```

### 5. Criar Hook

```typescript
// src/hooks/useBookings.ts
import { useEffect, useState } from 'react';
import { serviceContainer } from '../core/config/ServiceContainer';
import { Booking } from '../types';

export function useBookings(userId: string) {
  const bookingService = serviceContainer.getBookingService();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingService.getUserBookings(userId);
        setBookings(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [userId]);

  return {
    bookings,
    isLoading,
    error,
    createBooking: (data: Partial<Booking>) => bookingService.createBooking(data),
    cancelBooking: (id: string) => bookingService.cancelBooking(id),
  };
}
```

## 🎯 Padrão Resumido

1. **Interface** → Define contrato
2. **Repositório Local** → Implementa com localStorage
3. **Service** → Orquestra lógica de negócio
4. **ServiceContainer** → Registra e fornece
5. **Hook** → Expõe para componentes

## ✅ Checklist

- [ ] Criar IRepository específica
- [ ] Implementar LocalRepository
- [ ] Criar Service
- [ ] Registrar no ServiceContainer
- [ ] Criar Hook
- [ ] Testar fluxo completo
- [ ] Documentar uso

