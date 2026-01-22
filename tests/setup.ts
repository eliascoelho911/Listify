/**
 * Jest Setup File
 * Mocks for native modules required by Design System components
 */

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const createMockIcon = (name: string) => {
    const MockIcon = (props: Record<string, unknown>) =>
      React.createElement(View, { testID: `icon-${name}`, ...props });
    MockIcon.displayName = name;
    return MockIcon;
  };

  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop === 'string' && prop !== '__esModule') {
          return createMockIcon(prop);
        }
        return undefined;
      },
    },
  );
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'listTypes.notes': 'Notas',
        'listTypes.shopping': 'Compras',
        'listTypes.movies': 'Filmes',
        'listTypes.books': 'Livros',
        'listTypes.games': 'Jogos',
        'categoryDescriptions.shopping': 'Lista de compras com preços e quantidades',
        'categoryDescriptions.movies': 'Filmes e séries para assistir',
        'categoryDescriptions.books': 'Livros para ler',
        'categoryDescriptions.games': 'Jogos para jogar',
        'listForm.nameLabel': 'NOME DA LISTA',
        'listForm.namePlaceholder': 'Digite o nome da lista...',
        'listForm.nameRequired': 'Nome é obrigatório',
        'listForm.categoryLabel': 'CATEGORIA',
        'listForm.create': 'Criar Lista',
        'listForm.save': 'Salvar',
        'listForm.duplicateName': 'Já existe uma lista com este nome nesta categoria',
        'common.cancel': 'Cancelar',
        'listCard.itemCount.empty': 'Vazia',
        'listCard.itemCount.one': '1 item',
        'listCard.itemCount.many': `${options?.count} itens`,
        'listCard.systemBadge': 'Sistema',
        'listCard.accessibilityLabel': `${options?.name}, lista de ${options?.type}`,
        'categoryDropdown.emptyMessage': 'Nenhuma lista',
        'categoryDropdown.accessibilityLabel': `Categoria ${options?.category}, ${options?.count} listas, ${options?.state}`,
        'lists.title': 'Listas',
        'lists.empty.title': 'Nenhuma lista',
        'lists.empty.description': 'Crie uma lista usando o botão +',
        'settings.title': 'Configurações',
        'common.expanded': 'expandido',
        'common.collapsed': 'recolhido',
        'common.date': 'Data',
        'common.today': 'Hoje',
        'common.yesterday': 'Ontem',
        'common.weeksAgo': `${options?.count} semana${(options?.count as number) >= 2 ? 's' : ''} atrás`,
        'notes.characterCount': `${options?.count} caracteres`,
        'shopping.total': 'Total',
        'shopping.progress': `${options?.checked}/${options?.total} items`,
        'shopping.itemsWithoutPrice': `(${options?.count} without price)`,
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'pt-BR',
      changeLanguage: jest.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));
