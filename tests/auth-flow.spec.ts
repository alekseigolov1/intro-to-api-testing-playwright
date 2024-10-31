import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
const orderPath = 'orders'

test('correct username and password should return correct error code 401', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithIncorrectCredentials()

  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('Correct username and password should return correct error code 200', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()

  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log(await response.text())
})

//HW - 11

test('Correct username and password should return status code 200 and a valid JWT', async ({
  request,
}) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()

  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })

  expect(response.status()).toBe(StatusCodes.OK)
  console.log('response status:', response.status())
  const responseBody = await response.text()
  expect(jwtPattern.test(responseBody)).toBeTruthy()
})

test('Invalid HTTP method should return correct error code', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()

  const response = await request.get(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })

  expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  console.log('response status:', response.status())
})

test('succesfull authorization and order creation', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()

  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })

  expect(response.status()).toBe(StatusCodes.OK)
  console.log('response status:', response.status())
  const jwt = await response.text()
  const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
    data: OrderDto.createOrderWithCorrectRandomData(),
    headers:{
      Authorization: `Bearer ${jwt}`,
    }
  })
  const orderResponseJson = await orderResponse.json()
  console.log(orderResponseJson)
})
