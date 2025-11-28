'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/utils/auth';
import { User } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import CategorySelector from '@/components/CategorySelector';
import DermatologyChecklist from '@/components/DermatologyChecklist';

const BODY_LOCATIONS = [
  { value: 'glande', label: 'Glande' },
  { value: 'escroto', label: 'Escroto' },
  { value: 'prepucio', label: 'Prepúcio' },
  { value: 'corpo_peniano', label: 'Corpo Peniano' },
  { value: 'regiao_inguinal', label: 'Região Inguinal' },
  { value: 'perianal', label: 'Perianal' },
  { value: 'outro', label: 'Outro' },
];

const SKIN_COLORS = [
  { value: 'clara', label: 'Clara' },
  { value: 'morena', label: 'Morena' },
  { value: 'negra', label: 'Negra' },
  { value: 'amarela', label: 'Amarela' },
  { value: 'indigena', label: 'Indígena' },
];

interface ImageWithDescription {
  file: File;
  description: string;
}

export default function SubmitPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    diagnosis: '',
    body_location: '',
    patient_age: '',
    patient_skin_color: '',
    category_ids: [] as string[],
  });
  const [images, setImages] = useState<ImageWithDescription[]>([]);
  const [checklistData, setChecklistData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const { api } = await import('@/services/api');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('diagnosis', formData.diagnosis);
      formDataToSend.append('body_location', formData.body_location);
      formDataToSend.append('patient_age', formData.patient_age);
      formDataToSend.append('patient_skin_color', formData.patient_skin_color);
      formData.category_ids.forEach(id => {
        formDataToSend.append('category_ids', id);
      });
      
      images.forEach((imageData, index) => {
        formDataToSend.append('images', imageData.file);
        formDataToSend.append(`image_descriptions`, imageData.description || '');
      });
      
      // Add checklist data
      formDataToSend.append('checklist_data', JSON.stringify(checklistData));

      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await api.createPublication(formDataToSend);
      
      setUploadProgress(100);
      
      setTimeout(() => {
        router.push('/profile?success=true');
      }, 1000);
    } catch (error: any) {
      console.error('Error submitting publication:', error);
      alert(error.message || 'Erro ao enviar publicação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-text">Nova Publicação</h1>
            <p className="text-gray-600 mt-1">
              Contribua com o Atlas Dermatológico enviando um novo caso clínico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Upload de Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens do Caso *
              </label>
              <ImageUpload images={images} setImages={setImages} />
              <p className="text-sm text-gray-500 mt-2">
                Máximo de 10 imagens. Formatos aceitos: JPG, PNG, GIF (até 10MB cada)
              </p>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                  placeholder="Ex: Caso de pápulas perláceas em paciente jovem"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temas *
                </label>
                <CategorySelector
                  selectedCategories={formData.category_ids}
                  onCategoriesChange={(categories) => {
                    setFormData(prev => ({
                      ...prev,
                      category_ids: categories
                    }));
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Selecione uma ou mais temas relacionadas
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                Diagnóstico *
              </label>
              <input
                type="text"
                id="diagnosis"
                name="diagnosis"
                required
                value={formData.diagnosis}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="Ex: Pápulas perláceas do pênis"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição do Caso
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="Descreva o caso clínico, sintomas, evolução, tratamento..."
              />
            </div>

            {/* Dados do Paciente */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-text mb-4">Dados do Paciente</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="body_location" className="block text-sm font-medium text-gray-700">
                    Localização Corporal *
                  </label>
                  <select
                    id="body_location"
                    name="body_location"
                    required
                    value={formData.body_location}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Selecione</option>
                    {BODY_LOCATIONS.map((location) => (
                      <option key={location.value} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="patient_age" className="block text-sm font-medium text-gray-700">
                    Idade do Paciente
                  </label>
                  <input
                    type="number"
                    id="patient_age"
                    name="patient_age"
                    min="0"
                    max="120"
                    value={formData.patient_age}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                    placeholder="Ex: 35"
                  />
                </div>

                <div>
                  <label htmlFor="patient_skin_color" className="block text-sm font-medium text-gray-700">
                    Cor da Pele
                  </label>
                  <select
                    id="patient_skin_color"
                    name="patient_skin_color"
                    value={formData.patient_skin_color}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Selecione</option>
                    {SKIN_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dermatology Checklist */}
            <DermatologyChecklist
              data={checklistData}
              onChange={setChecklistData}
            />

            {/* Progress Bar */}
            {isLoading && (
              <div className="bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Enviando publicação...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2">
                  <div
                    className="bg-primary h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || images.length === 0 || formData.category_ids.length === 0}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? 'Enviando...' : 'Enviar Publicação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}