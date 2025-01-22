import React, { useState, useEffect } from "react";
import "../../styles/App.css";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

function App() {
  const [todos, setTodos] = useState([]);
  const createUser = async () => {
    const response = await fetch(
      "https://playground.4geeks.com/todo/users/sassy",
      {
        method: "POST",
        body: JSON.stringify([]),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("user created sucsessfully");
    } else {
      setErrorMessage("failed to create user");
      window.location.reload(false);
    }
  };

  const fetchTodo = async () => {
    const response = await fetch(
      "https://playground.4geeks.com/todo/users/sassy",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      await createUser();
      return;
    }

    const data = await response.json();
    console.log("API response: data", data);

    if (data && Array.isArray(data.todos)) {
      setTodos(data.todos);
    } else {
      console.error("Expected an array, received:", JSON.stringify(data));
      setTodos([]); // Reset to empty array if unexpected response
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const addTodo = async (todo) => {
    let newTodos = [...todos, todo];
    setTodos(newTodos);
    //send the new todo to the server
    const response = await fetch(
      "https://playground.4geeks.com/todo/todos/sassy",
      {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      console.log("successfully added todo", result);
    } else {
      console.error(`Failed to add todo. ${response.status}`);
    }
  };

  const removeTodo = async (id) => {
    let updatedTodos = [...todos].filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${id}`,
      {
        method: "DELETE",
        
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      console.log("successfully deleted todo", result);
    } else {
      console.error(`Failed to remove todo. ${response.status}`);
    }
  };

  const completeTodo = async (id) => {
    let updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, is_done: !todo.is_done } : todo
    );
    setTodos(updatedTodos);

    const updatedTodo = updatedTodos.find((todo) => todo.id === id);

    await fetch(`https://playground.4geeks.com/todo/todos/sassy/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTodo),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        console.log("Todo status updated");
      } else {
        console.error("Failed to update todo status");
      }
    });
  };

  const importantTodo = (id) => {
    let updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, important: !todo.important } : todo
    );
    setTodos(updatedTodos);
  };

  // const importantTodo = (id) => {
  //   let updatedTodos = todos.map((todo) => {
  //     if (todo.id === id) {
  //       todo.important = !todo.important;
  //     }
  //     return todo;
  //   });

  //   setTodos(updatedTodos);
  // };
  // let sortedTodos = todos.sort((a, b) => b.important - a.important);

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <hr className="seperator" />
      {todos.map((todo) => {
        return (
          <TodoItem
            removeTodo={removeTodo}
            completeTodo={completeTodo}
            importantTodo={importantTodo}
            todo={todo}
            key={todo.id}
          />
        );
      })}
    </div>
  );
}

export default App;
