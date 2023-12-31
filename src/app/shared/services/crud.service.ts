import { Observable } from 'rxjs';

export interface CrudService {
  
  list(): Observable<any>;
  get(id: number): Observable<any>;

  add(resource: any): Observable<any>;

  update(resource: any): Observable<any>;

  remove(id: number): Observable<any>;

  addMany(resources: any[]): Observable<any[]>;
}
