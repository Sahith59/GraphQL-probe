"use client";

import { useState } from "react";

type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type SeedOrder = {
  id: string;
  ownerId: string;
  status: string;
  total: number;
};

const DEFAULT_QUERY = `query {
  order(id: "4021") {
    id
    ownerId
    status
    total
  }
}`;

export default function GraphqlWorkbench({
  initialUser,
  demoUsers,
  orders
}: {
  initialUser: PublicUser | null;
  demoUsers: PublicUser[];
  orders: SeedOrder[];
}) {
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [email, setEmail] = useState(demoUsers[0]?.email || "");
  const [password, setPassword] = useState("demo1234");
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [response, setResponse] = useState("No GraphQL request sent yet.");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await result.json();

    if (!result.ok) {
      setError(data.error || "Login failed");
      return;
    }

    setUser(data.user);
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  }

  async function runQuery(nextQuery = query) {
    setQuery(nextQuery);
    setStatus("loading");
    const result = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: nextQuery })
    });
    const text = await result.text();

    try {
      setResponse(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      setResponse(text);
    }

    setStatus(`${result.status} ${result.statusText}`);
  }

  function queryFor(id: string) {
    return `query {
  order(id: "${id}") {
    id
    ownerId
    status
    total
    privateNote
  }
}`;
  }

  return (
    <section className="workbench">
      <aside className="rail" aria-label="Session and seeded order IDs">
        <div className="railBlock">
          <p className="kicker">Session</p>
          {user ? (
            <div className="signedIn">
              <p className="identity">{user.name}</p>
              <p className="muted">
                {user.email}
                <br />
                <strong>{user.id}</strong>
              </p>
              <button className="button secondary" onClick={logout} type="button">
                Sign out
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={login}>
              <label>
                Email
                <select value={email} onChange={(event) => setEmail(event.target.value)}>
                  {demoUsers.map((demoUser) => (
                    <option key={demoUser.id} value={demoUser.email}>
                      {demoUser.email} ({demoUser.id})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
              </label>
              {error ? <p className="error">{error}</p> : null}
              <button className="button" type="submit">
                Sign in
              </button>
            </form>
          )}
        </div>

        <div className="railBlock">
          <p className="kicker">Seed IDs</p>
          <div className="orderList">
            {orders.map((order) => (
              <button key={order.id} type="button" onClick={() => runQuery(queryFor(order.id))}>
                <span>#{order.id}</span>
                <small>{order.ownerId}</small>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="console" aria-label="GraphQL console">
        <div className="consoleTop">
          <div>
            <p className="kicker">GraphQL body</p>
            <h2>Query editor</h2>
          </div>
          <span className="status">{status}</span>
        </div>

        <div className="editorGrid">
          <label className="editorLabel">
            Query
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} spellCheck={false} />
          </label>
          <label className="editorLabel">
            Response
            <pre className="response">{response}</pre>
          </label>
        </div>

        <div className="actions">
          <button className="button" onClick={() => runQuery()} type="button">
            Run query
          </button>
          <code>query &#123; order(id: "4021") &#123; id ownerId &#125; &#125;</code>
        </div>
      </section>
    </section>
  );
}
