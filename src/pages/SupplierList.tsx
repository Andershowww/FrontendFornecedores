import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCard } from '../components/SupplierCard';
import { SupplierFiltersComponent } from '../components/SupplierFilters';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { SupplierFilters } from '../types/supplier';

export const SupplierList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SupplierFilters>({
    search: '',
    category: undefined,
    status: 'all'
  });

  const { suppliers, loading, error, refetch } = useSuppliers(filters);

  const handleNewSupplier = () => {
    navigate('/suppliers/new');
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <ErrorAlert message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">Fornecedores</h1>
              <p className="text-muted mb-0">
                Gerencie seus fornecedores cadastrados
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleNewSupplier}
            >
              <Plus className="me-2" size={16} />
              Novo Fornecedor
            </button>
          </div>
        </div>
      </div>

      <SupplierFiltersComponent
        search={filters.search || ''}
        onSearch={(newSearch) => setFilters(prev => ({ ...prev, search: newSearch }))}
        onFiltersChange={setFilters} 
      />

      {suppliers.length === 0 ? (
        <div className="text-center py-5">
          <div className="card border-0">
            <div className="card-body">
              <h5 className="card-title text-muted">
                Nenhum fornecedor encontrado
              </h5>
              <p className="card-text text-muted">
                {filters.search || filters.category || (filters.status !== 'all')
                  ? 'Tente ajustar os filtros para encontrar fornecedores.'
                  : 'Comece cadastrando seu primeiro fornecedor.'
                }
              </p>
              {!filters.search && !filters.category && filters.status === 'all' && (
                <button
                  className="btn btn-primary"
                  onClick={handleNewSupplier}
                >
                  <Plus className="me-2" size={16} />
                  Cadastrar Primeiro Fornecedor
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col">
              <p className="text-muted mb-0">
                Exibindo {suppliers.length} fornecedor{suppliers.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>

          <div className="row g-4">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="col-xl-4 col-lg-6">
                <SupplierCard
                  supplier={supplier}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};