export interface User {
  email: string,
  password: string,
  role: [string]
}

export interface Photo {
  imageSrc: string,
  userEmail: string,
  description: string,
  moderation: boolean,
  public: boolean
}

export interface SocketMessageDto {
  userEmail: string;
  receiverEmail?: string;
  passenger: [{
    email: string,
    message: string,
    date: Date
  }]
}

export interface Travel {
  userEmail: string;
  endPoint: [{ latitude: string, longitude: string }],
  startPoint: [{ latitude: string, longitude: string }],
  costPerPeople: string,
  description: string,
  isPublic: true,
  peoplesCount: string,
  title: string,
  travelTarget: string,
  travelTechnique: [string],
  travelType: string
  imageSrc: string
  address: string;
  date: string;
}
