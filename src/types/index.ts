export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Country {
  _id: string
  name: string
  code: string
  flag: string
}

export interface CountryDetail extends Country {
  emergency: {
    police: string
    ambulance: string
    fire: string
    tourist: string
  }
  food: any
  scams: any
  transport: any
  visa: any
}

export interface Subscription {
  subscribed: boolean
  status: string
  currentPeriodEnd: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}