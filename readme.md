| Scenario # | Description                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------- |
| 1          | PUT: Correct ID and valid key updates order and returns correct code                        |
| 2          | PUT : Invalid api-key is rejected as unauthorised                                           |
| 3          | PUT : Correct return code is returned in case orderID is out of range (BAD_REQUEST          |
| 4          | DELETE: Correct ID and valid key deletes order and returns success code 204(NO_CONTENT)     |
| 5          | DELETE: Request without valid key is rejected with correct return code                      |
| 6          | DELETE: Invalid order ID fails as bad request with correct return code                      |
| 7          | GET: Correct error code is returned if username and password are correctly set with api-key |
| 8          | GET: Empty username fails as server error                                                   |

HW - 10

| #   | Endpoint | Test                                                                                            |
| --- | -------- | ----------------------------------------------------------------------------------------------- |
| 1   | POST     | Calculate risk score with valid date for Low Risk level - positive decision - receive code 200  |
| 2   | POST     | Calculate risk score with valid date for Medium risk level- positive decision- receive code 200 |
| 3   | POST     | Calculate risk score with valid date for High risk - positive decision - receive code 200       |
| 4   | POST     | Calculate risk score with data for negative decision - receive code 200                         |
| 5   | POST     | Calculate risk score with invalid data (no incomes) - receive code 400                          |
| 6   | POST     | Calculate risk score with invalid data (debt < 0) - receive code 400                            |

HW - 11

| #   | Endpoint | Test                                                                              |
| --- | -------- | --------------------------------------------------------------------------------- |
| 1   | POST     | Correct username and password should return status code - 200(OK) and a valid JWT |
| 2   | POST     | Invalid HTTP method should return correct error code - 405(Method not allowed)    |

HW - 12

| #   | Endpoint | Test                                                           |
| --- | -------- | -------------------------------------------------------------- |
| 1   | POST     | Authorization and get Order by ID (without API client)         |
| 2   | GET      | Authorization and deletion of order by ID (without API client) |
