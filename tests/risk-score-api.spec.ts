import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { RiskDto } from './risk-dto'

test('Calculate risk score with valid data for Low Risk level - positive decision - receive code 200', async ({
                                                                                                                request,
                                                                                                              }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: RiskDto.calculateRiskScore(),
    },
  )

  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)

  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskScore).toBeDefined()
  expect.soft(responseBody.riskLevel).toBe('Low Risk')
  expect.soft(responseBody.riskPeriods).toBeDefined()
  expect.soft(responseBody.applicationId).toBeTruthy()
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('Calculate risk score with valid data for Medium risk level- positive decision- receive code 200', async ({
                                                                                                                 request,
                                                                                                               }) => {
  const riskDto = RiskDto.calculateRiskScore()
  riskDto.loanPeriod = 9
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: riskDto,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)


  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskScore).toBeDefined()
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskPeriods).toBeDefined()
  expect.soft(responseBody.applicationId).toBeTruthy()
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('Calculate risk score with valid data for High risk - positive decision - receive code 200', async ({
                                                                                                           request,
                                                                                                         }) => {
  const riskDto = RiskDto.calculateRiskScore()
  riskDto.loanPeriod = 3
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: riskDto,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)

  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskScore).toBeDefined()
  expect.soft(responseBody.riskLevel).toBe('High Risk')
  expect.soft(responseBody.riskPeriods).toBeDefined()
  expect.soft(responseBody.applicationId).toBeTruthy()
  expect.soft(responseBody.riskDecision).toBe('positive')
})
test('Calculate risk score with data for negative decision - receive code 200', async ({
                                                                                         request,
                                                                                       }) => {
  const riskDto = RiskDto.calculateRiskScore()
  riskDto.income = 1000
  riskDto.loanPeriod = 36
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: riskDto,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)

  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskScore).toBeDefined()
  expect.soft(responseBody.riskLevel).toBe('Very High Risk')
  expect.soft(responseBody.riskPeriods).toBeDefined()
  expect.soft(responseBody.applicationId).toBeTruthy()
  expect.soft(responseBody.riskDecision).toBe('negative')
})

test('Calculate risk score with invalid data (no incomes) - receive code 400', async ({
                                                                                        request,
                                                                                      }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: RiskDto.calculateInvalidRiskScore(),
    },
  )

  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('Calculate risk score with invalid data (debt < 0) - receive code 400', async ({
                                                                                      request,
                                                                                    }) => {
  const riskDto = RiskDto.calculateInvalidRiskScore()
  riskDto.income = 1000
  riskDto.debt = -12

  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: riskDto,
    },
  )
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})