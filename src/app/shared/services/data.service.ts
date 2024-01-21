import { CrudService } from './crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export class DataService implements CrudService {

  // Set the content type for POST and PUT requests
  private readonly headers = { 'Content-Type': 'application/json' };

  // Constructor with dependencies injection
  constructor(private readonly url: string, private readonly http: HttpClient) {}

  // Method to retrieve all resources
  list(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      catchError(error => {
        return of(error.resp);
      })
    );
  }

  // Method to retrieve a specific resource by ID
  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}${id}`+'/');
  }

    // Method to retrieve a specific resource by ID
    getByName(name: string): Observable<any> {
      return this.http.get<any>(`${this.url}${name}`+'/');
    }

  // Method to create a new resource
  add(resource: any): Observable<any> {
    return this.http.post<any>(this.url, resource).pipe(
      catchError(error => {
        return of(error.resp);
      }));
  }

  // Method to update an existing resource
  update(resource: any): Observable<any> {
    return this.http.put<any>(this.url, resource);
  }

  // Method to delete an existing resource by ID
  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}${id}`);
  }

  // Method to create multiple resources at once
  addMany(resources: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}`, resources);
  }
}

