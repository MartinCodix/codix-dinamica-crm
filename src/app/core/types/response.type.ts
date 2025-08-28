export interface ResponseType<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}
