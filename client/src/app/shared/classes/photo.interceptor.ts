import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";

@Injectable()
export class PhotoInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(map(
      (data: any) => {
        if (request.method === "PATCH" && /\/api\/photo\//.test(request.url) && data.status) {
          console.log(data)
        }
        return data
      },
      (err: any) => console.log(err)
    ));
  }
}
