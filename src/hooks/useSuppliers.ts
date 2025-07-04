import { useState, useEffect } from 'react';
import { Supplier, SupplierFilters } from '../types/supplier';
import { supplierService } from '../services/supplierService';

export const useSuppliers = (filters?: SupplierFilters) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getSuppliers(filters);
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [filters?.search, filters?.category, filters?.status]);

  const refetch = () => {
    fetchSuppliers();
  };

  return {
    suppliers,
    loading,
    error,
    refetch
  };
};