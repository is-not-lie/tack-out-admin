import { AxiosResponse } from 'axios'
import {
  LoginParams
} from './request'

export interface LoginData extends LoginParams {
  callback?: (params?: AxiosResponse) => void
}
