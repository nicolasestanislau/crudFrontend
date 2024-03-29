"use client";
import React from "react";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";

import axios from "axios";

import "./style.css";
// Refatorar tudo, criar cada function separada
export default function Home() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisbility, setInputVisbility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  async function handleWithNewButton() {
    setInputVisbility(!inputVisbility);
  }

  async function getTodos() {
    const response = await axios.get("http://localhost:3333/todos");
    console.log("fffff ", response);
    setTodos(response.data);
  }

  async function createTodo() {
    const response = await axios.post("http://localhost:3333/todos", {
      name: inputValue,
    });
    getTodos();
    setInputVisbility(!inputVisbility);
    setInputValue("");
  }

  async function editTodo() {
    const response = await axios.put("http://localhost:3333/todos", {
      id: selectedTodo.id,
      name: inputValue,
    });
    setSelectedTodo();
    setInputVisbility(false);
    getTodos();
    setInputValue("");
  }

  async function deleteTodo(todo) {
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    getTodos();
  }

  async function modifyStatusTodo(todo) {
    console.log("ddd");

    const res = await axios.put("http://localhost:3333/todos", {
      id: todo.id,
      status: !todo.status,
    });
    console.log("res ", res);
    getTodos();
  }
  const Todos = ({ todos }) => {
    return (
      <div className="todos">
        {todos.map((todo, index) => {
          return (
            <div className="todo" key={index}>
              <button
                onClick={() => modifyStatusTodo(todo)}
                className="button"
                checked={todo.status}
                style={{ backgroundColor: todo.status ? "purple" : "grey" }}
              ></button>
              <p>{todo.name}</p>
              <button
                onClick={() => handleWithEdit(todo)}
                className="button"
                style={{ backgroundColor: todo.status ? "purple" : "grey" }}
              >
                <FontAwesomeIcon size={20} icon={faEdit} />
              </button>
              <button onClick={() => deleteTodo(todo)} className="button">
                <FontAwesomeIcon size={20} icon={faDeleteLeft} />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  async function handleWithEdit(todo) {
    setSelectedTodo(todo);
    setInputVisbility(true);
  }

  useEffect(() => {
    getTodos();
  }, []);
  return (
    <main className="App">
      <header className="container">
        <div className="header">
          <h1>Dont be lazzy </h1>
        </div>
        <Todos todos={todos}></Todos>
      </header>
      <input
        value={inputValue}
        style={{ display: inputVisbility ? "block" : "none" }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        className="inputName"
      ></input>
      <button
        onClick={
          inputVisbility
            ? selectedTodo
              ? editTodo
              : createTodo
            : handleWithNewButton
        }
        className="button newTaskButton"
      >
        {inputVisbility ? "Confirm" : "New task"}
      </button>
    </main>
  );
}
