import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import axios, { AxiosError } from 'axios'
import { OrderDto } from './dto/order-dto'
const serviceURL = 'https://backend.tallinn-learning.ee/test-orders'
test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect(response.status()).toBe(StatusCodes.OK)
})
test('get order with incorrect id should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())

  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('post order with correct data should receive code 200', async ({ request }) => {
  // prepare request body
  const orderDto = new OrderDto('OPEN', 0, 'aleksei', '+37256710032', 'test', 1)

  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: orderDto,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})
test('post order with incorrect data should receive code 400', async ({ request }) => {
  // prepare request body
  const orderDto = new OrderDto('CLOSED', 0, 'aleksei', '+37256710032', 'test', 1)

  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: orderDto,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('PUT: Correct ID and valid key updates order and returns correct code', async ({
  request,
}) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const orderDto = new OrderDto('OPEN', 0, 'aleksei', '+37256710032', 'test', 1)
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeaders,
    data: orderDto,
  })
  expect(response.status()).toBe(StatusCodes.OK)
})

test('PUT : Invalid  api-key is rejected as unauthorised    ', async ({ request }) => {
  const requestHeaders = {
    api_key: '123456786',
  }
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'test',
    customerPhone: 'test',
    comment: 'test',
    id: 0,
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeaders,
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('PUT : Correct return code is returned in case orderID is out of range (BAD_REQUEST) ', async ({
  request,
}) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/11', {
    headers: requestHeaders,
    data: OrderDto.createOrderWithCorrectRandomData(),
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('DELETE: Correct ID and valid key deletes order and returns success code 204(NO_CONTENT) ', async ({
  request,
}) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/9', {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('DELETE: Request without valid api-key is rejected with correct return code ', async ({
  request,
}) => {
  const requestHeaders = {
    api_key: '123456890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/9', {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('DELETE: Invalid order ID fails as bad request with correct return code ', async ({
  request,
}) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/0', {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('GET: Correct error code is returned if username and password are correctly set with api-key', async ({
  request,
}) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=username&password=password',
    {
      headers: requestHeaders,
    },
  )
  expect(response.status()).toBe(StatusCodes.OK)
})

test('GET: Correct error code is returned if username is empty', async ({ request }) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=&password=password',
    {
      headers: requestHeaders,
    },
  )
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})
test('GET: Correct error code is returned if  password is empty', async ({ request }) => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=username&password=',
    {
      headers: requestHeaders,
    },
  )
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('PUT: Correct return code is returned in case orderID is out of range (BAD_REQUEST) - AXIOS', async () => {
  const requestHeaders = {
    api_key: '1234567890123456',
  }
  const orderDto = new OrderDto('OPEN', 0, 'aleksei', '+37256710032', 'test', 1)

  try {
    await axios.put('https://backend.tallinn-learning.ee/test-orders/11', orderDto, {
      headers: requestHeaders,
    })
  } catch (error) {
    const axiosError = error as AxiosError // Casting error to AxiosError
    if (axiosError.response) {
      expect(axiosError.response.status).toBe(StatusCodes.BAD_REQUEST)
    }
  }
})

test('SOFT: post order with correct data should receive code 200', async ({ request }) => {
  // prepare request body with dto pattern
  const requestBody = new OrderDto('OPEN', 0, 'John Doe', '+123456789', 'Urgent order', 0)
  const response = await request.post(serviceURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.status).toBe('OPEN')
  expect.soft(responseBody.courierId).toBeDefined()
  expect.soft(responseBody.customerName).toBeDefined()
})
