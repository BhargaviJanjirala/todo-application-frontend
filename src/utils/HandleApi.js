import axios from "axios";

export const addTodo = async (text, userId, setText, setTodo) => {
  try {
    const response = await axios.post(
      "https://todo-application-backend-2.onrender.com/todos",
      {
        text,
        user_id: userId,
      }
    );
    setTodo((prevTodos) => [...prevTodos, response.data]);
    setText("");
  } catch (error) {
    console.error("Error adding todo:", error.message);
  }
};
export const getAllTodo = async (userId, setTodo) => {
  try {
    const response = await axios.get(
      `https://todo-application-backend-2.onrender.com/todos?user_id=${userId}`
    );
    setTodo(response.data);
  } catch (error) {
    console.error("Error fetching todos:", error.message);
  }
};

export const updateTodo = async (
  id,
  text,
  userId,
  setTodo,
  setText,
  setIsUpdating
) => {
  try {
    const response = await axios.put(
      `https://todo-application-backend-2.onrender.com/todos/${id}`,
      {
        text,
        user_id: userId,
      }
    );
    setTodo((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? response.data : todo))
    );
    setText("");
    setIsUpdating(false);
  } catch (error) {
    console.error("Error updating todo:", error.message);
  }
};
export const deleteTodo = async (id, userId, setTodo) => {
  try {
    await axios.delete(
      `https://todo-application-backend-2.onrender.com/todos/${id}`,
      {
        data: { user_id: userId },
      }
    );
    setTodo((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
  } catch (error) {
    console.error("Error deleting todo:", error.message);
  }
};
