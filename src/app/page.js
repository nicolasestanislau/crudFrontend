"use client";
import React from "react";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";

import axios from "axios";

import "./style.css";

const Todos = ({ todos }) => {
  return (
    <div className="todos">
      {todos.map((todo, index) => {
        return (
          <div className="todo" key={index}>
            <button
              className="button"
              checked={todo.status}
              style={{ backgroundColor: todo.status ? "purple" : "grey" }}
            ></button>
            <p>{todo.name}</p>
            <button
              className="button"
              style={{ backgroundColor: todo.status ? "purple" : "grey" }}
            >
              <FontAwesomeIcon size={20} icon={faEdit} />
            </button>
            <button className="button">
              <FontAwesomeIcon size={20} icon={faDeleteLeft} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
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
  }
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisbility, setInputVisbility] = useState(false);

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
        onClick={inputVisbility ? createTodo : handleWithNewButton}
        className="button newTaskButton"
      >
        {inputVisbility ? "Confirm" : "New task"}
      </button>
    </main>
  );
}
