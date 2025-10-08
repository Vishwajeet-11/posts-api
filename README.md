# Posts API

REST API built with **Node.js (ESM)**, **Express**, **Mongoose**, and **AWS S3**. Supports posts with tags, full‑text search, filtering, sorting, and pagination via a centralized Mongoose paginate plugin. Includes a Postman collection.

---

## Features

* Post model: `title`, `desc`, `image`, `tags[]`
* Tag model: unique `name`
* **Unified listing**: `GET /api/posts?search=...&tags=...&page=...&limit=...&sort=...`
* **Dedicated search route**: `GET /api/posts/search?search=...` (sugar over list)
* Central **paginate plugin** for all models
* **Image upload to S3** using multer memory storage
* Clean ESM modules across the codebase
* Postman collection provided in the repo root

---

## Tech Stack

* Node.js 18+, Express 4
* MongoDB 5+/Atlas, Mongoose 8
* AWS S3 (SDK v2, ESM-compatible import). Note: v2 is in maintenance mode; v3 snippet included below.

---

## Project Structure

```
posts-api/
  src/
    app.js
    server.js
    config/
      db.js
      s3.js
    controllers/
      post.controller.js
      tag.controller.js
    middlewares/
      error.js
    models/
      Post.js
      Tag.js
    plugins/
      paginate.plugin.js
    routes/
      index.js
      post.routes.js
      tag.routes.js
    utils/
      catchAsync.js
      multer.js
      pick.js
  PostsAPI.postman_collection.json
  PostsAPI.local_environment.json
  .env.example
  package.json
  README.md
```

---

## Quick Start

```bash
npm i
cp .env.example .env   # fill placeholders below
npm run dev
```

Server: `http://localhost:4000/api`

---

## Environment (.env)

Use placeholders that **do not look like real secrets** to avoid GitHub push protection. Replace with your values locally.

```env
# App
PORT=4000
MONGODB_URI=mongodb://localhost:27017/posts_api

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET=your-s3-bucket-name
# If you expose objects publicly via bucket policy:
AWS_S3_PUBLIC_BASE=https://your-s3-bucket-name.s3.ap-south-1.amazonaws.com
```

**Notes**

* Do **not** commit a real `.env`. Ensure `.env` is in `.gitignore`.
* If your bucket uses "Bucket owner enforced" (ACLs disabled), code sets no ACL and relies on bucket policy for public reads. See S3 setup below.

---

## API Endpoints

Base URL: `/api`

### Health

* `GET /api/health` → `{ status: 'ok' }`

### Tags

* `POST /api/tags` → `{ name }`
* `GET /api/tags?page=1&limit=10&sort=createdAt:desc`

### Posts

* `POST /api/posts` **multipart/form-data**

  * fields: `title` (required), `desc` (optional), `tags[]` (optional, names or ObjectIds)
  * file: `image` (optional)
* `PATCH /api/posts/:id` **multipart/form-data** (same fields as create)
* `GET /api/posts` with query params:

  * `search` full-text search across `title` and `desc`
  * `tags` comma-separated names or ObjectIds
  * `page`, `limit`
  * `sort` e.g. `createdAt:desc,title:asc`
  * `select` to project fields
* `GET /api/posts/search?search=keyword` (alias to list)
* `GET /api/posts/:id`
* `DELETE /api/posts/:id`

### Examples

```http
GET /api/posts?search=node&tags=tech,nodejs&page=2&limit=5&sort=createdAt:desc
```

**cURL create with image**

```bash
curl -X POST http://localhost:4000/api/posts \
  -F "title=My First Post" \
  -F "desc=Description here" \
  -F "tags=tech" \
  -F "tags=nodejs" \
  -F "image=@/path/to/file.png"
```

---

## Postman Collection

* **Included files:**

  * `PostsAPI.postman_collection.json`
  * `PostsAPI.local_environment.json`
* Import both into Postman, then set `baseUrl` to your server (local or deployed).
* The create/update requests are pre-configured for **multipart/form-data**.

---

## Search Implementation

* `Post` schema defines a text index: `{ title: 'text', desc: 'text' }`.
* Controller builds `filter.$text = { $search: req.query.search }` when `search` is provided.
* Use either `GET /api/posts?search=...` or `GET /api/posts/search?search=...`.

---

## Pagination Plugin

`src/plugins/paginate.plugin.js` provides:

```js
Model.paginate(filter, {
  page, limit, sort, select, populate, lean
});
```

* Sorting format: `field:asc|desc` separated by commas.
* Unified response: `{ results, page, limit, total, totalPages }`.

---

## S3 Setup

**Option A: Public objects via bucket policy (no ACLs)**

1. Bucket in `ap-south-1` with **Object Ownership: Bucket owner enforced**.
2. **Bucket policy** to allow reads:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-s3-bucket-name/*"
    }
  ]
}
```

3. IAM policy for the app user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:PutObject","s3:GetObject"], "Resource": "arn:aws:s3:::your-s3-bucket-name/*" },
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::your-s3-bucket-name" }
  ]
}
```

4. Code uploads **without ACL** and serves via `AWS_S3_PUBLIC_BASE`.

**Option B: Private objects**

* No bucket policy. Keep uploads private. Return **presigned GET URLs**.
* Can provide a helper if needed.

**Note on SDK v3**

* Current code uses AWS SDK v2 for simplicity. To migrate to v3:

```js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ region: process.env.AWS_REGION });
await s3.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
```

---

## ESM Notes

* The project is `"type": "module"`.
* When importing CommonJS packages (e.g., `mongoose`, `http-status`, `aws-sdk` v2), **default import then destructure**.
* Always include `.js` in relative imports, e.g., `import routes from './routes/index.js'`.

---

## Deployment

* Render or Railway:

  * Build command: `npm i`
  * Start command: `npm run start`
  * Env vars: same as `.env`
* MongoDB Atlas for hosted DB.

---

## License

MIT (or add your preferred license).
