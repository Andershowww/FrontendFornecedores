import React from 'react';
import { Supplier } from '../types/supplier';
import { Building,  MapPin, FileText,Home} from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ 
  supplier, 
}) => {

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header bg-transparent border-bottom-0 d-flex justify-content-between align-items-center">
        <h6 className="card-title mb-0 text-truncate" title={supplier.nomeFantasia}>
          <Building className="me-2" size={16} />
          {supplier.nomeFantasia}
        </h6>
      </div>
      <div className="card-body">
        <div className="mb-2">
          <small className="text-muted d-flex align-items-center">
            <FileText className="me-1" size={14} />
            {supplier.cnpj}
          </small>
        </div>
        <div className="mb-2">
          <small className="text-muted d-flex align-items-center">
            <MapPin className="me-1" size={14} />
            {supplier.endereco.municipio}, {supplier.endereco.uf}
          </small>
        </div>
        
        <div className="mb-3">
          <small className="text-muted d-flex align-items-center">
            <Home className="me-1" size={14} />
            {supplier.endereco.logradouro}, {supplier.endereco.bairro}
          </small>
        </div>
      </div>
      
      <div className="card-footer bg-transparent border-top-0"/>
    </div>
  );
};