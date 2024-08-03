import { useEffect, useState } from "react";
import { addTodo, getAllTodo, updateTodo, deleteTodo } from "./utils/HandleApi";
import supabase from "./lib/helper/supabaseClient";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error("Error getting user session:", err.message);
      } finally {
        setLoading(false);
      }
    };
    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getAllTodo(user.id, setTodos)
        .catch((err) => {
          setError("Error fetching todos");
          console.error("Error fetching todos:", err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Login error:", error.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleAddTodo = () => {
    if (text.trim()) {
      addTodo(text, user.id, setText, setTodos);
    }
  };

  const handleUpdateTodo = () => {
    if (text.trim() && todoId) {
      updateTodo(todoId, text, user.id, setTodos, setText, setIsUpdating);
    }
  };

  const handleEditClick = (id, currentText) => {
    setTodoId(id);
    setText(currentText);
    setIsUpdating(true);
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id, user.id, setTodos);
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="container">
      {user ? (
        <>
          <div className="header">
            <h1>Todo App</h1>
            <button onClick={logout}>Logout</button>
          </div>
          <div className="todos-container">
            {error && <p>{error}</p>}
            <div className="input-container">
              <input
                type="text"
                placeholder="Add or update todo"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={isUpdating ? handleUpdateTodo : handleAddTodo}>
                {isUpdating ? "Update Todo" : "Add Todo"}
              </button>
            </div>
            <h2>Your Todos:</h2>
            {todos.length ? (
              <ul>
                {todos.map((todo) => (
                  <li key={todo._id}>
                    <p>{todo.text}</p>
                    <div className="icons">
                      <button
                        onClick={() => handleEditClick(todo._id, todo.text)}
                      >
                        <BiEdit className="icon" />
                      </button>
                      <button onClick={() => handleDeleteTodo(todo._id)}>
                        <AiFillDelete className="icon" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No todos available.</p>
            )}
          </div>
        </>
      ) : (
        <div className="login-container">
          <h1>Todo App</h1>
          <div>
            <p>Please log in with</p>
            <button onClick={login}>
              <FcGoogle />
              oogle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
