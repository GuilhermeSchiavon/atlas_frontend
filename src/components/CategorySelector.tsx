'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { Category } from '@/types';

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function CategorySelector({ selectedCategories, onCategoriesChange }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelected);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim()) return;

    try {
      const response = await api.createCategory(newCategoryTitle.trim());
      setCategories([...categories, response.category]);
      onCategoriesChange([...selectedCategories, response.category.id.toString()]);
      setNewCategoryTitle('');
      setIsCreating(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      alert('Erro ao criar categoria');
    }
  };

  const getSelectedCategoriesText = () => {
    if (selectedCategories.length === 0) return 'Selecione os temas';
    if (selectedCategories.length === 1) {
      const category = categories.find(c => c.id.toString() === selectedCategories[0]);
      return category ? category.title : 'Categoria selecionada';
    }
    return `${selectedCategories.length} categorias selecionadas`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCategories.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
          {getSelectedCategoriesText()}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Buscar temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="max-h-40 overflow-y-auto">
            {filteredCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id.toString())}
                  onChange={() => handleCategoryToggle(category.id.toString())}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-sm">{category.title}</span>
              </label>
            ))}

            {filteredCategories.length === 0 && searchTerm && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Nenhuma categoria encontrada
              </div>
            )}
          </div>

          {searchTerm && filteredCategories.length === 0 && (
            <div className="border-t p-2">
              {!isCreating ? (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="w-full px-3 py-2 text-sm text-primary hover:bg-primary hover:text-white rounded transition-colors"
                >
                  + Criar categoria "{searchTerm}"
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome da nova categoria"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="flex-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                    >
                      Criar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setNewCategoryTitle('');
                      }}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}