export interface User {
  technique: { license: any; name: any }[];
  email: string,
  password: string,
  role: [string],
  reviews: [{ userEmail: string, commentText: string }],
  ratings: [{ travelTitle: string, travelId: string, sumValue: number }],
  fio: string
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
  passenger?: [{
    email: string,
    message: string,
    date: Date
  }]
}

export interface Travel {
  name: string;
  travelId: string;
  userEmail: string;
  userFIO: string;
  date: Date;
  address: string;
  endPoint: [{ latitude: string, longitude: string }],
  startPoint: [{ latitude: string, longitude: string }],
  costPerPeople: string,
  description: string,
  isPublic: boolean,
  peoplesCount: number,
  title: string,
  travelTarget: string,
  travelTechnique: [string],
  travelType: string;
  imageSrc: string;
  joinedUsers: [{
    userEmail: string
    fio: string
    status: string
    comment: string
    nickName: string
  }]
  _id: string
  status: string
}

export interface Review {
  userEmail: string
  reviewText: string
  travelId: string
  date: Date
  travelName: string
  userFIO: string
  isShown: boolean
  rejectionReason: string
}
