import { useState, useCallback } from 'react';
import { fetchAddressByCEP, type ViaCEPResponse } from '@/lib/utils/cep';

export interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
}

export interface UseCEPReturn {
  loading: boolean;
  error: string | null;
  addressData: AddressData | null;
  fetchAddress: (cep: string) => Promise<AddressData | null>;
  clearError: () => void;
}

export function useCEP(): UseCEPReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const fetchAddress = useCallback(async (cep: string): Promise<AddressData | null> => {
    setLoading(true);
    setError(null);
    setAddressData(null);

    try {
      const data = await fetchAddressByCEP(cep);

      if (!data) {
        setError('CEP não encontrado. Preencha o endereço manualmente.');
        return null;
      }

      const address: AddressData = {
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento,
      };

      setAddressData(address);
      return address;
    } catch (err) {
      setError('Erro ao buscar CEP. Verifique sua conexão ou preencha manualmente.');
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    addressData,
    fetchAddress,
    clearError,
  };
}
