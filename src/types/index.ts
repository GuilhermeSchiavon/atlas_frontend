export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cpf?: string;
  crm: string;
  uf: string;
  especialidade: 'Urologista' | 'Dermatologista';
  accounType: 'adm' | 'associado';
  status: 'ativo' | 'inativo' | 'pendente' | 'banida';
}

export interface Category {
  id: number;
  title: string;
  description?: string;
  slug: string;
  status: 'ativo' | 'inativo';
  publicationCount?: number;
}

export interface Image {
  id: number;
  publication_id: number;
  filename: string;
  path_local: string;
  format: string;
  size: number;
  order: number;
  description?: string;
}

export interface Publication {
  id: number;
  title: string;
  description?: string;
  diagnosis: string;
  body_location: 'glande' | 'escroto' | 'prepucio' | 'corpo_peniano' | 'regiao_inguinal' | 'perianal' | 'outro';
  patient_age?: number;
  patient_skin_color?: 'clara' | 'morena' | 'negra' | 'amarela' | 'indigena';
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  rejection_reason?: string;
  checklist_data?: any;
  createdAt: string;
  updatedAt: string;
  Categories?: Category[];
  Author?: User;
  Images?: Image[];
}

export interface AuthResponse {
  user: User;
  token: string;
}