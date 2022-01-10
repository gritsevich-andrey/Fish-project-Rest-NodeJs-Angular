// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {Constants} from "./Constants";
export const environment: Constants = {
  production: false,
  AUTH_API: '/api/auth',
  CABINET_API: '/api/cabinet',
  ADMIN_API: '/api/administrator',
  COMPLAINT_API: '/api/complaint',
  PHOTO_API: '/api/photo',
  BACK_URL: 'localhost:5000',
  CHAT_API: '/api/chat',
  TRAVEL_API: '/api/travels'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
