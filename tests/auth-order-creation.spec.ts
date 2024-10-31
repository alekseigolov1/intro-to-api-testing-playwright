import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'
import {ApiClient} from './api/api-client'

test('Correct username and password should return correct error code 200', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request) //already authorized
  await apiClient.createOrderAndReturnOrderId()
})
