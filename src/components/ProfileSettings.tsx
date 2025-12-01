'use client';

import { useState } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface ProfileSettingsProps {
  user: User;
  setUser: (user: User) => void;
}

const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function ProfileSettings({ user, setUser }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    cpf: user.cpf || '',
    crm: user.crm,
    uf: user.uf,
    especialidade: user.especialidade
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Limite: 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.uploadProfileImage(formData);
      
      // Atualizar o usuário local com o caminho da imagem retornado pelo servidor
      const updatedUser = { ...user, image: response.imagePath };
      setUser(updatedUser);
      
      setImageFile(null);
      setImagePreview(null);
      alert('Imagem atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert(error.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.updateProfile(formData);
      setUser(response.user);
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      alert(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-text mb-6">Configurações da Conta</h2>
      
      {/* Foto de Perfil */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Foto de Perfil</h3>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-primary text-white rounded flex items-center justify-center text-2xl font-bold overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : user.image ? (
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/${user.image}`} 
                alt="Perfil" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.innerHTML = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
                  }
                }}
              />
            ) : (
              `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image"
            />
            <label
              htmlFor="profile-image"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Escolher Imagem
            </label>
            {imageFile && (
              <button
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="ml-2 btn-primary px-4 py-2 text-sm disabled:opacity-50"
              >
                {uploadingImage ? 'Enviando...' : 'Salvar Imagem'}
              </button>
            )}
            <p className="text-sm text-gray-500 mt-1">JPG, JPEG ou PNG. Máximo 5MB.</p>
          </div>
        </div>
      </div>

      {/* Informações Pessoais */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Sobrenome *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>
          </div>
        </div>

        {/* Informações Profissionais */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Profissionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF *
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                required
                value={formData.cpf}
                onChange={handleChange}
                placeholder="12345678901"
                maxLength={11}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="crm" className="block text-sm font-medium text-gray-700">
                CRM *
              </label>
              <input
                type="text"
                id="crm"
                name="crm"
                required
                value={formData.crm}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
                UF *
              </label>
              <select
                id="uf"
                name="uf"
                required
                value={formData.uf}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
              >
                <option value="">Selecione</option>
                {UF_OPTIONS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700">
                Especialidade *
              </label>
              <select
                id="especialidade"
                name="especialidade"
                required
                value={formData.especialidade}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
              >
                <option value="">Selecione</option>
                <option value="Urologista">Urologista</option>
                <option value="Dermatologista">Dermatologista</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-6 py-2 disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}