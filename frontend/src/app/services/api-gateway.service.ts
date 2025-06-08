import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrlOLTP = 'http://localhost:3001/api/oltp/';
  private apiUrlOLAP = 'http://localhost:3001/api/olap/reccomandation';

  constructor(private http: HttpClient) { }

  informationOLTP(item_id: number, limit: number): Observable<any> {
    return this.http.get(this.apiUrlOLTP, {
      params: {
        item_id: item_id.toString(),
        limit: limit.toString()
      }
    });
  }

  informationOLAP(item_id: number, limit: number): Observable<any> {
    const body = {
      "item_id": item_id,
      "limit": limit
    };
    return this.http.post(this.apiUrlOLAP, body);
  }
}