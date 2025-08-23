// UI Types - User interface related types
export interface ComponentSize {
  small: 'sm';
  medium: 'md';
  large: 'lg';
  extraLarge: 'xl';
}

export interface ComponentVariant {
  primary: 'primary';
  secondary: 'secondary';
  success: 'success';
  warning: 'warning';
  error: 'error';
  info: 'info';
}

export interface ButtonProps {
  size?: ComponentSize[keyof ComponentSize];
  variant?: ComponentVariant[keyof ComponentVariant];
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: ComponentSize[keyof ComponentSize];
  variant?: ComponentVariant[keyof ComponentVariant];
  disabled?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  autoFocus?: boolean;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnOverlayClick?: boolean;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error?: string;
  retry?: () => void;
}

export interface EmptyState {
  isEmpty: boolean;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: any[];
  hasMore: boolean;
}

export interface FilterState {
  activeFilters: Record<string, any>;
  availableFilters: FilterOption[];
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'text';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
  availableFields: SortField[];
}

export interface SortField {
  key: string;
  label: string;
  sortable: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: any) => void;
  selectable?: boolean;
  selectedRows?: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
}