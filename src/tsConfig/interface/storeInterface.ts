export interface commitData {
  key: string;
  val: any | object
}

export interface loginData {
  phone: string;
  password?: string;
  callback?: () => void
}

export interface loginVer {
  phone: string;
  password?: string;
  code?: string;
  captcha?: string;
}
