"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { SnackbarProvider, useSnackbar } from "notistack";
import axios from "axios";
import "./style.css";
import "./globals.css";

interface Todo {
  id: number;
  name: string;
  status: boolean;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [checkList, setCheckList] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [open, setOpen] = useState(false);

  async function getTodos() {
    try {
      const response = await axios.get("http://localhost:3333/todos");
      const todosData = Array.isArray(response.data) ? response.data : [];
      setTodos(todosData);
      setCheckList(todosData.length === 0);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
      setCheckList(true);
    }
  }

  async function createTodo() {
    if (inputValue.trim().length === 0) {
      enqueueSnackbar("Tarefa vazia.", { variant: "error" });
      return;
    }

    const exists = todos.some((todo) => todo.name === inputValue);
    if (exists) {
      enqueueSnackbar("Tarefa já existe.", { variant: "error" });
      return;
    }

    try {
      await axios.post("http://localhost:3333/todos", { name: inputValue });
      getTodos();
      setInputValue("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  }

  async function editTodo(todo: Todo) {
    if (!todo) return;

    try {
      const updatedTodo = {
        id: todo.id,
        name: inputValue, // Atualiza apenas o nome com o valor do input
        status: todo.status, // Mantém o status atual
      };

      await axios.put(`http://localhost:3333/todos`, updatedTodo);

      // Resetando estados e recarregando a lista
      setSelectedTodo(null);
      setOpen(false);
      setInputValue("");
      getTodos();
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  }

  async function deleteTodo(todo: Todo) {
    try {
      await axios.delete(`http://localhost:3333/todos/${todo.id}`);
      getTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function modifyStatusTodo(todo: Todo) {
    try {
      await axios.put(`http://localhost:3333/todos/${todo.id}`, {
        ...todo,
        status: !todo.status,
      });
      getTodos();
    } catch (error) {
      console.error("Error modifying todo status:", error);
    }
  }

  function handleOpen(todo: Todo) {
    setSelectedTodo(todo);
    setInputValue(todo.name); // Preenche o input com o nome do todo selecionado
    setOpen(true);
  }

  function handleClose() {
    setSelectedTodo(null);
    setOpen(false);
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <SnackbarProvider maxSnack={3}>
      <main className="App">
        <header className="container">
          <section className="buttonContainer">
            <TextField
              hiddenLabel
              variant="filled"
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="inputName"
            />
            <Button
              startIcon={<ControlPointIcon />}
              variant="contained"
              onClick={createTodo}
            >
              {inputValue ? "Confirmar" : "Nova tarefa"}
            </Button>
          </section>

          <div className="header">
            <h1>Lista de tarefas</h1>
          </div>
          <main className={checkList ? "todos" : "todosFull"}>
            {checkList && (
              <div>
                <PlaylistAddIcon sx={{ fontSize: 64, color: "#fff" }} />
                <p style={{ color: "rebeccapurple" }}>
                  Nenhuma tarefa registrada. Crie novas tarefas!
                </p>
              </div>
            )}
            {todos.map((todo) => (
              <div className="todo" key={todo.id}>
                <button
                  onClick={() => modifyStatusTodo(todo)}
                  className="button"
                >
                  <CheckCircleOutlineIcon
                    style={{
                      backgroundColor: todo.status ? "purple" : "grey",
                      borderRadius: "16px",
                    }}
                  />
                </button>
                <p>{todo.name}</p>
                <button onClick={() => handleOpen(todo)} className="button">
                  <FontAwesomeIcon size={"lg"} icon={faEdit} />
                </button>
                <button onClick={() => deleteTodo(todo)} className="button">
                  <FontAwesomeIcon size={"lg"} icon={faDeleteLeft} />
                </button>
                <Modal open={open} onClose={handleClose}>
                  <Box sx={style}>
                    <Typography id="modal-title" variant="h6">
                      Editar Tarefa
                    </Typography>
                    <TextField
                      fullWidth
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      label="Tarefa"
                    />
                    <Button
                      onClick={() => editTodo(todo)}
                      variant="contained"
                      color="primary"
                    >
                      Salvar
                    </Button>
                  </Box>
                </Modal>
              </div>
            ))}
          </main>
        </header>
      </main>
    </SnackbarProvider>
  );
}
