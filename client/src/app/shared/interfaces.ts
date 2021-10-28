export interface User {
  email: string,
  password: string,
  role:[string]
}
export interface Photo {
  imageSrc: string,
  userEmail: string,
  description: string,
  moderation: boolean,
  public: boolean
}
