import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const {user, authStatus, signOut} = useAuthenticator((context) => [context.user, context.authStatus]);
  console.log(user, authStatus);

  useEffect(() => {
    if (authStatus === 'configuring') {
      return; //don't update yet
    }

    const isLogin = authStatus === 'authenticated';
    console.log('LOGIN', isLogin);
    setLoggedIn(isLogin);
  }, [authStatus])

  useEffect(() => {
    if (authStatus === 'configuring') {
      return; //don't update yet
    }

    console.log(authStatus, isLoggedIn);
    try {
      client.models.Todo.observeQuery({authMode: authStatus === 'authenticated' || isLoggedIn ? 'userPool' : 'identityPool'})
        .subscribe
        ({
          next: (data) => setTodos([...data.items]),
        });
    } catch (error) {
      console.error(error);
    }
  }, [authStatus, isLoggedIn]);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") },{authMode: isLoggedIn ? 'userPool' : 'identityPool'});
  }

  //Function testMessage
  async function handleTest() {
    try {
      const {data: testRes} = await client.queries.testMessage({
        name: 'Test public auth',
      },{authMode: isLoggedIn ? 'userPool' : 'identityPool'});
      console.log("Success: ",testRes);
    } catch (error) {
      console.error(error);
    }
  };

  //Function testMessage
  async function handleSignOut() {
    signOut();
    navigate('/');
  };

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>

      <button onClick={handleTest}>Test Function</button>
      <br />
      {!isLoggedIn ? 
      (<div>
        <button onClick={() => navigate('/auth')}>Login</button>
      </div>) : (
        <div>
          <h2>{user?.signInDetails?.loginId}</h2>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>)
      }
    </main>
  );
}

export default App;
