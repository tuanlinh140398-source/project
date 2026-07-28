# Viettel Academy Course Registration API

Backend API for course registration - "Ứng dụng AI dành cho Developer" khóa đào tạo của học viện Viettel.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **Cloudflare Workers** - Serverless runtime
- **Cloudflare D1** - SQLite Database
- **Vitest** - Testing framework

## Project Structure

```
src/
├── controllers/           # API handlers
├── services/             # Business logic
├── repositories/         # Database access (D1)
├── validation/           # Input validation
├── routes/               # API routes
├── types/                # TypeScript interfaces
├── index.ts              # Express app configuration
└── server.ts             # Cloudflare Workers handler

db/
└── migrations/           # Database migration files

tests/
└── registration.test.ts  # Unit tests
```

## API Endpoints

### POST /api/registrations

Register for the course.

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn An",
  "employeeCode": "VT001234",
  "department": "Trung tâm Công nghệ",
  "phoneNumber": "0987654321"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Nguyễn Văn An",
    "employeeCode": "VT001234",
    "department": "Trung tâm Công nghệ",
    "phoneNumber": "0987654321",
    "createdAt": "2026-07-28T10:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data or missing fields
- `409 Conflict` - Employee code already registered

### GET /api/list

Get list of all registrations.

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "fullName": "Nguyễn Văn An",
    "employeeCode": "VT001234",
    "department": "Trung tâm Công nghệ",
    "phoneNumber": "0987654321",
    "created": "28/07/2026"
  }
]
```

## Validation Rules

- **Full Name**: Required, 2-255 characters
- **Employee Code**: Required, 3-50 characters, unique
- **Department**: Required, 2-255 characters
- **Phone Number**: Required, Vietnamese format (10-11 digits, starts with 0)

All fields are trimmed of whitespace.

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn
- Cloudflare account with D1 access

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create Cloudflare D1 Database:**
   ```bash
   wrangler d1 create course-registration-db
   ```

   Note the database ID and update `wrangler.jsonc` with it.

3. **Run migrations:**
   ```bash
   npm run db:migrate:local
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration.

## Development

### Local Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Type Checking

```bash
npm run typecheck
```

### Testing

Run tests:
```bash
npm test
```

Run tests once:
```bash
npm run test:run
```

## Building

Build for production:
```bash
npm run build
```

This generates files in the `dist/` directory.

## Deployment

### Deploy to Cloudflare Workers

1. **Ensure database is set up:**
   ```bash
   wrangler d1 create course-registration-db
   ```

2. **Update database ID in wrangler.jsonc**

3. **Run migrations on production database:**
   ```bash
   npm run db:migrate
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

The API will be deployed to your Cloudflare Workers account.

## Testing Scenarios

### Success Case
```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An",
    "employeeCode": "VT001234",
    "department": "Trung tâm Công nghệ",
    "phoneNumber": "0987654321"
  }'
```

### Missing Fields
```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An"
  }'
```

### Invalid Phone Number
```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An",
    "employeeCode": "VT001234",
    "department": "Trung tâm Công nghệ",
    "phoneNumber": "123456789"
  }'
```

### Duplicate Employee Code
```bash
# First registration
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An",
    "employeeCode": "VT001234",
    "department": "Trung tâm Công nghệ",
    "phoneNumber": "0987654321"
  }'

# Second registration with same employee code (returns 409)
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Trần Thị B",
    "employeeCode": "VT001234",
    "department": "Phòng Marketing",
    "phoneNumber": "0912345678"
  }'
```

### Get Registrations List
```bash
curl http://localhost:8787/api/list
```

## Environment Variables

Create `.env` file with:
```
# Cloudflare
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
DATABASE_ID=your_d1_database_id
```

## Troubleshooting

### Database Connection Issues
- Verify database ID in `wrangler.jsonc`
- Check Cloudflare authentication: `wrangler auth login`

### Migration Issues
- Ensure `wrangler` is properly installed: `npm install -g wrangler`
- Check database exists: `wrangler d1 list`

### Type Errors
- Run `npm run typecheck` to see all TypeScript errors
- Check `tsconfig.json` is properly configured

## License

MIT
