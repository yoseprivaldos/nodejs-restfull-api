# User API Spec

## Register User API

Endpoints: POST /api/users

Request Body :

```json
{
    "username": "yoseprivaldos",
    "password": "rahasia",
    "name": "Yosep R Silaban"
}
```

Response Body Success :

```json
{
    "data": {
        "username": "yoseprivaldos",
        "name": "Yosep R Silaban"
    }
}
```

Response Body Error:

```json
{
    "errors": "Username already registered"
}
```

## Login User API

Endpoinst : POST/api/users/login

Request Body:

```json
{
    "username": "yoseprivaldos",
    "password": "rahasia"
}
```

Response Body Success:

```json
{
    "data": {
        "token": "unique token"
    }
}
```

Response Body Error:

```json
{
    "errors": "username or password wrong"
}
```

## Update User API

Endpoints : PATCH /api/users/current

Headers: - Authorization : token

Request Body:

```json
{
    "name": "Yosep R Silaban Baru", // optional
    "password": "new password" // optional
}
```

Response Body Success:

```json
{
    "data": {
        "username": "yoseprivaldos",
        "name": "Yosep R Silaban Baru"
    }
}
```

Response Body Error:

```json
{
    "error": "Name length max 100"
}
```

## Get User API

Endpoints: GET /api/susers/current

Headers: - Authorization : token

Response Body Success

```json
{
    "data": {
        "username": "yoseprivaldos",
        "name": "Yosep R Silaban"
    }
}
```

Response Body Error

```json
{
    "errors": "Unauthorized"
}
```

## Log Out User API

Endpoint: DELETE /api/users/logout

Headers: - Authorization : token

Response Body Success:

```json
{
    "data": "OK"
}
```

Response BOdy Error:

```json
{
    "errors": "unauthorized"
}
```
