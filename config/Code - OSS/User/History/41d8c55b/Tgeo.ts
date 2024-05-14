export interface IResponse<T> {
  status: Boolean;
  message: String;
  data: T;
}
