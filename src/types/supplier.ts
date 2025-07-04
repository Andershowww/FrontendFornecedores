export interface Supplier {
  id: number;  
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnae: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
}

export interface CreateSupplierData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnae: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
}

export interface SupplierFilters {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'all';
}