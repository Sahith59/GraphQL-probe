import GraphqlWorkbench from "./graphql/graphql-workbench";
import { orders, publicUser, users } from "./lib/data";
import { currentUser } from "./lib/session";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="shell">
      <section className="banner" aria-labelledby="title">
        <div className="bannerCopy">
          <p className="eyebrow">BoLD fixture / App 3</p>
          <h1 id="title">GraphQL order probe</h1>
          <p className="lede">
            A request-body object lookup where the ID lives inside the GraphQL query, not in the URL.
          </p>
        </div>
        <div className="routePlate">
          <span>POST</span>
          <code>/api/graphql</code>
        </div>
      </section>

      <GraphqlWorkbench
        initialUser={user ? publicUser(user) : null}
        demoUsers={users.map(publicUser)}
        orders={orders.map(({ id, ownerId, status, total }) => ({ id, ownerId, status, total }))}
      />
    </main>
  );
}
