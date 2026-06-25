# Heaven on Clouds — API Specification

Base URL: `http://localhost:5000/api`

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |

## Auth (planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |

## Tours (planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tours` | List & filter tours |
| GET | `/tours/:slug` | Tour detail |
| POST | `/admin/tours` | Create tour (admin) |

## Bookings (planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create booking |
| GET | `/bookings/my` | User bookings |

## Payments (planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/simulate` | KPay/WavePay simulation |
