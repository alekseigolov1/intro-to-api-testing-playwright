import { expect, test } from '@playwright/test'
import { ApiClient } from './api/api-client'

test('Correct username and password should return correct error code 200', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request) //already authorized
  const orderId = await apiClient.createOrderAndReturnOrderId()
  expect.soft(orderId).toBeDefined()
})
