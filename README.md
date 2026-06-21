# BoLD App 3 - GraphQL

Standalone Next.js application for testing BoLD against an authorization flaw where the object ID is supplied inside a GraphQL request body instead of the URL path.

## Contract

- Route: `app/api/graphql/route.ts`
- Method: `POST`
- Object ID location: GraphQL query body, not the URL path
- Example query: `query { order(id: "4021") { id ownerId } }`
- Auth: request must come from a logged-in user
- Intentional flaw: any logged-in user can query another user's order ID and receive it

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Users

All accounts use password `demo1234`.

- `maya@bold.test` -> `usr_101`
- `liam@bold.test` -> `usr_202`
- `sofia@bold.test` -> `usr_303`

## Test Probe

1. Log in as `maya@bold.test`.
2. Send `query { order(id: "4021") { id ownerId } }`.
3. The response is Maya's order and includes `"ownerId":"usr_101"`.
4. Send `query { order(id: "8310") { id ownerId } }`.
5. The response is Liam's order and includes `"ownerId":"usr_202"`, even though Maya is still logged in.

That cross-user GraphQL read is the intentional BOLA behavior for BoLD to detect.

## Deploy

This folder is self-contained and can be pushed as its own GitHub repository or imported directly into Vercel.
