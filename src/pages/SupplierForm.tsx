import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search } from 'lucide-react';
import { supplierService } from '../services/supplierService';

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const SupplierForm: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    cnae:'',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      cep: '',
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    }

    if (!formData.razaoSocial.trim()) {
      newErrors.razaoSocial = 'Razão Social é obrigatória';
    }

    if (!formData.nomeFantasia.trim()) {
      newErrors.nomeFantasia = 'Nome Fantasia é obrigatório';
    }

    if (!formData.endereco.logradouro.trim()) {
      newErrors['endereco.logradouro'] = 'Logradouro é obrigatório';
    }

    if (!formData.endereco.numero.trim()) {
      newErrors['endereco.numero'] = 'Número é obrigatório';
    }

    if (!formData.endereco.bairro.trim()) {
      newErrors['endereco.bairro'] = 'Bairro é obrigatório';
    }

    if (!formData.endereco.municipio.trim()) {
      newErrors['endereco.municipio'] = 'Município é obrigatório';
    }

    if (!formData.endereco.uf) {
      newErrors['endereco.uf'] = 'UF é obrigatória';
    }

    if (!formData.endereco.cep) {
      newErrors['endereco.cep'] = 'Cep é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('endereco.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [addressField]: value.toUpperCase(), // UF em maiúscula
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const buscarDadosCnpj = async () => {
    if (!formData.cnpj.trim()) {
      setErrors(prev => ({ ...prev, cnpj: 'CNPJ é obrigatório para busca' }));
      return;
    }

    try {
      setLoadingCnpj(true);
      setError(null);

      const dados = await supplierService.buscarCnpj(formData.cnpj);
      console.log(dados)
      setFormData(prev => ({
        ...prev,
        razaoSocial: dados.razaoSocial || '',
        nomeFantasia: dados.nomeFantasia || '',
        cnae: dados.cnae || '',
        endereco: {
          logradouro: dados.endereco?.logradouro || '',
          numero: dados.endereco?.numero || '',
          complemento: dados.endereco?.complemento || '',
          bairro: dados.endereco?.bairro || '',
          municipio: dados.endereco?.municipio || '',
          uf: dados.endereco?.uf || '',
          cep: dados.endereco?.cep || '',
        }
      }));

      setErrors(prev => {
        const copy = { ...prev };
        delete copy.cnpj;
        delete copy['endereco.logradouro'];
        delete copy['endereco.numero'];
        delete copy['endereco.bairro'];
        delete copy['endereco.municipio'];
        delete copy['endereco.uf'];
        return copy;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar CNPJ');
    } finally {
      setLoadingCnpj(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      await supplierService.createSupplier(formData);

      setSuccess(true);
      setTimeout(() => navigate('/suppliers'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/suppliers');
  };

  if (success) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success text-center">
              <h4 className="alert-heading">Sucesso!</h4>
              <p className="mb-0">Fornecedor cadastrado com sucesso. Redirecionando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={handleBack}
              type="button"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="h3 mb-0">Novo Fornecedor</h1>
              <p className="text-muted mb-0">Preencha os dados para cadastrar um novo fornecedor</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="row mb-4">
          <div className="col">
            <div className="alert alert-danger">
              <strong>Erro:</strong> {error}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Dados Básicos</h5>
          </div>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label htmlFor="cnpj" className="form-label">CNPJ *</label>
                <input
                  type="text"
                  className={`form-control ${errors.cnpj ? 'is-invalid' : ''}`}
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  placeholder="00.000.000/0000-00"
                  disabled={loading || loadingCnpj}
                />
                {errors.cnpj && <div className="invalid-feedback">{errors.cnpj}</div>}
              </div>

              <div className="col-md-2 d-grid">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={buscarDadosCnpj}
                  disabled={loadingCnpj || loading}
                  title="Buscar dados pelo CNPJ"
                >
                  {loadingCnpj ? 'Buscando...' : <><Search size={16} className="me-1" /> Buscar</>}
                </button>
              </div>

              <div className="col-md-4" />

              <div className="col-md-6">
                <label htmlFor="razaoSocial" className="form-label">Razão Social *</label>
                <input
                  type="text"
                  className={`form-control ${errors.razaoSocial ? 'is-invalid' : ''}`}
                  id="razaoSocial"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.razaoSocial && <div className="invalid-feedback">{errors.razaoSocial}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="nomeFantasia" className="form-label">Nome Fantasia *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nomeFantasia ? 'is-invalid' : ''}`}
                  id="nomeFantasia"
                  name="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.nomeFantasia && <div className="invalid-feedback">{errors.nomeFantasia}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="cnae" className="form-label">Cnae </label>
                <input
                  type="text"
                  className={`form-control ${errors.cnae ? 'is-invalid' : ''}`}
                  id="cnae"
                  name="cnae"
                  value={formData.cnae}
                  onChange={handleInputChange}
                  placeholder=""
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Endereço</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="endereco.logradouro" className="form-label">Logradouro *</label>
                <input
                  type="text"
                  className={`form-control ${errors['endereco.logradouro'] ? 'is-invalid' : ''}`}
                  id="endereco.logradouro"
                  name="endereco.logradouro"
                  value={formData.endereco.logradouro}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors['endereco.logradouro'] && <div className="invalid-feedback">{errors['endereco.logradouro']}</div>}
              </div>

              <div className="col-md-3">
                <label htmlFor="endereco.numero" className="form-label">Número *</label>
                <input
                  type="text"
                  className={`form-control ${errors['endereco.numero'] ? 'is-invalid' : ''}`}
                  id="endereco.numero"
                  name="endereco.numero"
                  value={formData.endereco.numero}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors['endereco.numero'] && <div className="invalid-feedback">{errors['endereco.numero']}</div>}
              </div>

              <div className="col-md-3">
                <label htmlFor="endereco.complemento" className="form-label">Complemento</label>
                <input
                  type="text"
                  className="form-control"
                  id="endereco.complemento"
                  name="endereco.complemento"
                  value={formData.endereco.complemento}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="endereco.bairro" className="form-label">Bairro *</label>
                <input
                  type="text"
                  className={`form-control ${errors['endereco.bairro'] ? 'is-invalid' : ''}`}
                  id="endereco.bairro"
                  name="endereco.bairro"
                  value={formData.endereco.bairro}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors['endereco.bairro'] && <div className="invalid-feedback">{errors['endereco.bairro']}</div>}
              </div>

              <div className="col-md-4">
                <label htmlFor="endereco.municipio" className="form-label">Município *</label>
                <input
                  type="text"
                  className={`form-control ${errors['endereco.municipio'] ? 'is-invalid' : ''}`}
                  id="endereco.municipio"
                  name="endereco.municipio"
                  value={formData.endereco.municipio}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors['endereco.municipio'] && <div className="invalid-feedback">{errors['endereco.municipio']}</div>}
              </div>
              <div className="col-md-2">
                <label htmlFor="endereco.uf" className="form-label">UF *</label>
                <select
                  className={`form-select ${errors['endereco.uf'] ? 'is-invalid' : ''}`}
                  id="endereco.uf"
                  name="endereco.uf"
                  value={formData.endereco.uf}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  {states.map(uf => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                {errors['endereco.uf'] && <div className="invalid-feedback">{errors['endereco.uf']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="endereco.cep" className="form-label">Cep *</label>
                <input
                  type="text"
                  className={`form-control ${errors['endereco.cep'] ? 'is-invalid' : ''}`}
                  id="endereco.cep"
                  name="endereco.cep"
                  value={formData.endereco.cep}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors['endereco.cep'] && <div className="invalid-feedback">{errors['endereco.cep']}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="me-2" size={16} />
                    Salvar Fornecedor
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleBack}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
