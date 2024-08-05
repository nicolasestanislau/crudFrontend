"use client";
import React, { useEffect, useState, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SnackbarProvider, useSnackbar } from "notistack";
import axios from "axios";
import "./style.css";
import "./globals.css";

interface Todo {
  id: number;
  name: string;
  status: boolean;
}

const styles = {
  select: {
    height: '100%',
    marginBottom: '8px',
  },
  addChannelButton: {
    marginBottom: '16px',
  },
  button: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#a879e6',
  },
  buttonHover: {
    backgroundColor: '#9259c5',
  }
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  //const [inputVisibility, setInputVisibility] = useState<boolean>(false);
  const [checkList, setCheckList] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (todo: Todo) => {
    handleWithEdit(todo)
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  /*   async function handleWithNewButton() {
      setInputVisibility(!inputVisibility);
    } */

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
      enqueueSnackbar("Tarefa vazia.", { variant: 'error' });
      return;
    }

    const exists = todos.some(todo => todo.name === inputValue);
    if (exists) {
      alert("Task already exists");
      return;
    }

    try {
      await axios.post("http://localhost:3333/todos", { name: inputValue });
      getTodos();
      ///setInputVisibility(false);
      setInputValue("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  }

  async function editTodo() {
    console.log('isoasi')
    if (!selectedTodo) return;

    const exists = todos.some(todo => todo.name === inputValue);
    if (exists) {
      alert("Task already exists");
      return;
    }

    try {
      await axios.put(`http://localhost:3333/todos/${selectedTodo.id}`, { name: inputValue, id: selectedTodo.id, status: selectedTodo.status });
      setSelectedTodo(null);
      //setInputVisibility(false);
      getTodos();
      setInputValue("");
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
      const response = await axios.put("http://localhost:3333/todos", { status: !todo.status, id: todo.id, name: todo.name });
      getTodos();
    } catch (error: any) {
      console.error("Error modifying todo status:", error.response ? error.response.data : error.message);
    }
  }

  function Todos({ todos }: { todos: Todo[] }) {
    return (
      <main className={checkList ? 'todos' : 'todosFull'}>
        {checkList && (
          <div>
            <PlaylistAddIcon sx={{ fontSize: 64, color: '#fff' }} />
            <p style={{ color: 'rebeccapurple' }}>No momento, você não tem nenhuma tarefa registrada. Crie tarefas e organize seus itens de tarefas.</p>
          </div>
        )}

        {Array.isArray(todos) && todos.map((todo, index) => (
          <div className="todo" key={index}>
            <button
              onClick={() => modifyStatusTodo(todo)}
              className="button"
            ><CheckCircleOutlineIcon style={{ backgroundColor: todo.status ? "purple" : "grey", borderRadius: "16px" }} /></button>
            <p>{todo.name}</p>
            <button
              onClick={() => handleOpen}
              className="button"
              style={{ backgroundColor: todo.status ? "purple" : "grey" }}
            >
              <FontAwesomeIcon size={"lg"} icon={faEdit} />
            </button>
            <button onClick={() => deleteTodo(todo)} className="button">
              <FontAwesomeIcon size={"lg"} icon={faDeleteLeft} />
            </button>
          </div>
        ))}
      </main>
    );
  }

  async function handleWithEdit(todo: Todo) {
    setSelectedTodo(todo);
    //setInputVisibility(true);
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
              id="filled-hidden-label-small"
              value={inputValue}
              variant="filled"
              size="small"
              sx={{
                '&:hover:not(.Mui-disabled):before': {
                  borderBottomColor: '#a879e6', // hover color
                },
                '&.Mui-focused:after': {
                  borderBottomColor: '#a879e6', // focus color
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setInputValue(e.target.value)}
              className="inputName"
            />

            <Button style={{
              ...styles.button,
              ...(isHovered ? styles.buttonHover : {})
            }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              startIcon={<ControlPointIcon />}
              variant="contained"
              onClick={createTodo}>
              {inputValue ? "Confrimar?" : "Nova tarefa"}
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
              </Box>
            </Modal>
          </section>

          <div className="header">
            <h1>Lista de tarefas</h1>
          </div>
          <Todos todos={todos} />
        </header>
      </main>
    </SnackbarProvider>
  );
}
