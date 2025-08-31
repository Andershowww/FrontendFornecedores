import { Supplier, CreateSupplierData, SupplierFilters } from '../types/supplier';

const API_BASE_URL = 'http://localhost:8080/fornecedores'; // troque pela URL real da sua API

class SupplierService {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  async getSuppliers(filters?: SupplierFilters): Promise<Supplier[]> {
    let url = `${API_BASE_URL}/lista-fornecedores`;
    
    // Pode adaptar para enviar filtros como query params, se sua API suportar
    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      // if (filters.category) params.append('category', filters.category);
      // if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }

    return this.request<Supplier[]>(url);
  }

  async getSupplierById(id: number): Promise<Supplier> {
    return this.request<Supplier>(`${API_BASE_URL}/fornecedores/${id}`);
  }

  async createSupplier(data: CreateSupplierData): Promise<Supplier> {
    // Ajuste dos campos para o backend, especialmente o endereco:
    const payload = {
      cnpj: data.cnpj,
      razaoSocial: data.razaoSocial, 
      nomeFantasia: data.nomeFantasia, 
      cnae: data.cnae,
      endereco: {
        logradouro: data.endereco.logradouro,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro, 
        municipio: data.endereco.municipio,
        uf: data.endereco.uf,
      },
     
    };

    return this.request<Supplier>(`${API_BASE_URL}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateSupplier(id: number, data: Partial<CreateSupplierData>): Promise<Supplier> {
    // Ajuste payload igual ao create, com dados parciais
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {};
    if (data.cnpj) payload.cnpj = data.cnpj;
    if (data.razaoSocial) {
      payload.razaoSocial = data.razaoSocial;
      payload.nomeFantasia = data.nomeFantasia; // ajuste conforme necessário
    }
    if (data.endereco) {
      payload.endereco = {
        logradouro: data.endereco.logradouro,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro, // caso tenha
        municipio: data.endereco.municipio,
        uf: data.endereco.uf,
      };
    }

    return this.request<Supplier>(`${API_BASE_URL}/fornecedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async buscarCnpj(cnpj: string): Promise<Partial<CreateSupplierData>> {
    const url = `${API_BASE_URL}/consulta-cnpj?cnpj=${cnpj.replace(/\D/g, '')}`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar CNPJ: ${response.status} - ${errorText}`);
    }
  
    const data = await response.json();
  
    // Mapear a resposta para o formato parcial do CreateSupplierData para preencher o formulário
    return {
      cnpj: data.cnpj,
      razaoSocial: data.razaoSocial,
      nomeFantasia:data.nomeFantasia,
      cnae: data.cnae,
      endereco: {
        logradouro: data.endereco.logradouro,
        numero: data.endereco.numero || '',
        complemento: data.endereco.complemento || '',
        municipio:data.endereco.municipio,
        uf: data.endereco.uf,
        cep: data.endereco.cep || '',
        bairro: data.endereco.bairro || '',
      },
    
    };
  }
  async deleteSupplier(id: number): Promise<void> {
    await this.request<void>(`${API_BASE_URL}/fornecedores/${id}`, {
      method: 'DELETE'
    });
  }
}

export const supplierService = new SupplierService();
