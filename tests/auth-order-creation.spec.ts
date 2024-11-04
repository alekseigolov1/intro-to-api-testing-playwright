import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { ApiClient } from './api/api-client'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

test('Correct username and password should return correct error code 200', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request) //already authorized
  const orderId = await apiClient.createOrderAndReturnOrderId()
  expect.soft(orderId).toBeDefined()
})

//HW-12 - without api client
test('Authorization and get Order by ID (without API client)', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const authResponse = await request.post(`${serviceURL}${loginPath}`, { data: loginDto })
  expect.soft(authResponse.status()).toBe(StatusCodes.OK)
  const bearer = await authResponse.text()

  const orderDto = OrderDto.createOrderWithUndefinedID()
  const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
    data: orderDto,
    headers: { Authorization: `Bearer ${bearer}` },
  })
  expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
  const orderId = (await orderResponse.json()).id

  const getOrderResponse = await request.get(`${serviceURL}${orderPath}/${orderId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  })
  expect.soft(getOrderResponse.status()).toBe(StatusCodes.OK)
  const retrievedOrder = await getOrderResponse.json()
  expect.soft(retrievedOrder.id).toBe(orderId)
})

test('Authorization and deletion of order by ID (without API client)', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const authResponse = await request.post(`${serviceURL}${loginPath}`, { data: loginDto })
  expect.soft(authResponse.status()).toBe(StatusCodes.OK)
  const bearer = await authResponse.text()
  const orderDto = OrderDto.createOrderWithUndefinedID()

  const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
    data: orderDto,
    headers: { Authorization: `Bearer ${bearer}` },
  })
  expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
  const orderId = (await orderResponse.json()).id
  const deleteResponse = await request.delete(`${serviceURL}${orderPath}/${orderId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  })
  expect(deleteResponse.status()).toBe(StatusCodes.OK)
  const deleteResponseBody = await deleteResponse.json()
  expect(deleteResponseBody).toBe(true)

  const verifyDeleteResponse = await request.get(`${serviceURL}${orderPath}/${orderId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  })
  expect(verifyDeleteResponse.status()).toBe(StatusCodes.OK)
  const verifyDeleteResponseBody = await verifyDeleteResponse.text()
  expect(verifyDeleteResponseBody).toBe('')
})
