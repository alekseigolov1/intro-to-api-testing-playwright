| Scenario # | Description                                                             |
|------------|-------------------------------------------------------------------------|
| 1          | PUT: Correct ID and valid key updates order and returns correct code    |
| 2          | PUT : Invalid api-key is rejected as unauthorised                       |
| 3          | PUT : Correct return code is returned in case orderID is out of range (BAD_REQUEST                             |
| 4          | DELETE: Correct ID and valid key deletes order and returns success code 204(NO_CONTENT) |
| 5          | DELETE: Request without valid key is rejected with correct return code  |
| 6          | DELETE: Invalid order ID fails as bad request with correct return code  |
| 7          | GET: Correct error code is returned if username and password are correctly set with api-key                      |
| 8          | GET: Empty username fails as server error                               |