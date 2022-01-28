import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private http: HttpClient) { }

  createComplaint(email: string, description: string, senderEmail: string) {
    return this.http.post(environment.COMPLAINT_API, {email, description, senderEmail})
  }
}
