import React, { useState } from 'react';
import { SupplierFilters } from '../types/supplier';
interface Props {
  search: string;
  onSearch: (search: string) => void;
  onFiltersChange: (filters: SupplierFilters) => void
}

export const SupplierFiltersComponent: React.FC<Props> = ({ search, onSearch, onFiltersChange }) => {
  const [searchText, setSearchText] = useState(search || '');

  const handleApplySearch = () => {
    onSearch(searchText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  };
  const clearFilters = () => {
    onFiltersChange({ search: '', category: undefined, status: 'all' });
  };

  return (
    <div className="card mb-8">
      <div className="card-body">
        <div className="mb-4 d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Busque por nome ou cnpj..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary"
            onClick={handleApplySearch}
            type="button"
          >
            Buscar
          </button>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
            >
              Limpar
            </button>
          </div>

        </div>
      </div>
    </div >
  );
};
