export interface User {
  technique: { license: any; name: any }[];
  email: string,
  password: string,
  role: [string],
  reviews: [{ userEmail: string, commentText: string }],
  ratings: [{ travelTitle: string, travelId: string, sumValue: number }],
  fio: string
  juridicalPerson: string
  organizationName: string
  inn: string
  kpp: string
}

export interface Photo {
  id: string;
  imageSrc: string,
  userEmail: string,
  description: string,
  moderation: boolean,
  public: boolean
  queryDeleted?: boolean
}

interface PhotoComment {
  email: string
  value: string
}

export interface PhotoAdmin {
  imageSrc: string
  userEmail: string
  coordinates: string
  description: string
  moderation: boolean
  public: boolean
  banDescription: string
  date: Date
  likesCount: number
  longitude: number
  latitude: number
  address: string
  comments: PhotoComment[]
  queryDeleted: boolean
  _id: string
  fio: string
}

export interface SocketMessageDto {
  userEmail: string;
  receiverEmail?: string;
  passenger?: [{
    email: string,
    message: string,
    receiverEl?: string,
    date: Date
  }]
}

export interface Rating {
  email: string
  travelId: string
  travelName: string
  sumValue: number
  isRatingSet: boolean
}

export interface JoinedUser {
  userEmail: string
  fio: string
  status: string
  comment: string
  nickName: string
  rating: number
  isRatingSet: boolean
  travelRating: number
  isTravelRatingSet: boolean
}

export interface Travel {
  name: string;
  travelId: string;
  userEmail: string;
  userFIO: string;
  date: Date;
  address: string;
  fromAddress?: string;
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
  joinedUsers: JoinedUser[]
  _id: string
  status: string
  queryDelete: boolean
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

export interface LiveFeedPost {
  imageSrc: string
  userEmail: string
  description: string
  readMore: boolean
  showComments: boolean
  comments: any
  _id: string
  comment: string
  likesCount: number
  isLiked: boolean
  date: string
  latitude: number
  longitude: number
  address: string
}
