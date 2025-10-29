# Atlas Dermatológico do Genital Masculino - Frontend

Frontend desenvolvido em Next.js para o Atlas Dermatológico do Genital Masculino.

## Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **SWR** para cache de requisições
- **js-cookie** para gerenciamento de cookies

## Estrutura do Projeto

```
src/
├── app/                    # App Router pages
│   ├── auth/              # Páginas de autenticação
│   ├── chapter/[id]/      # Página de capítulo
│   ├── publication/[id]/  # Página de publicação
│   ├── submit/            # Formulário de envio
│   └── profile/           # Perfil do usuário
├── components/            # Componentes reutilizáveis
├── services/              # Integração com API
├── types/                 # Tipos TypeScript
└── utils/                 # Utilitários
```

## Funcionalidades

### Páginas Principais
- **Página inicial**: Busca, capítulos em destaque, publicações recentes
- **Capítulos**: Lista de publicações por capítulo
- **Publicação**: Visualização detalhada com imagens e dados clínicos
- **Envio**: Formulário para nova publicação com upload de imagens
- **Autenticação**: Login, registro e verificação por email
- **Perfil**: Gerenciamento de publicações e configurações

### Fluxo de Cadastro
1. Usuário cria conta com email, nome e CRM
2. Recebe email de confirmação
3. Após confirmação, pode enviar publicações
4. Sistema mostra status das publicações (pending, approved, rejected)

### Upload de Imagens
- Suporte a múltiplas imagens (máximo 5)
- Preview local antes do envio
- Drag & drop
- Validação de formato e tamanho

### SEO
- Metatags dinâmicas por página
- Open Graph tags
- Estrutura semântica
- Otimização de imagens com Next/Image

## Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## Configuração

Crie o arquivo `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:1000/api/v2
```

## Integração com Backend

O frontend consome a API REST do backend através do serviço `api.ts`:

- Autenticação JWT via cookies
- Upload de arquivos via FormData
- Cache de requisições com SWR
- Tratamento de erros

## Design System

### Cores
- **Primary**: #00332E (verde escuro)
- **Secondary**: #F4C692 (bege)
- **Background**: #FFFFFF (branco)
- **Text**: #1F2937 (cinza escuro)

### Componentes
- Design médico-científico limpo
- Tipografia legível
- Sem cantos arredondados
- Componentes desacoplados

## Próximos Passos

1. Integrar com API real do backend
2. Implementar autenticação completa
3. Adicionar testes unitários
4. Configurar CI/CD
5. Otimizar performance
6. Implementar PWA