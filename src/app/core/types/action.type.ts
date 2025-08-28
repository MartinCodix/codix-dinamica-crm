export interface ActionType {
  label: string;
  icon?: string; // PrimeIcons class, e.g. 'pi-pencil'
  variant?: 'default' | 'danger' ;
  handler: () => void;
}