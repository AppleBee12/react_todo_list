import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Todo from './Todo';
import { useCallback, useEffect, useState } from 'react';
import './App.css';



function App(value) {
  /* 
  //로컬 스토리지에 데이터 쓰기 setItem
  window.localStorage.setItem('name','홍길동');

  //로컬 스토리지에 데이터 읽기 getItem
  let test = window.localStorage.getItem('name');
  console.log(test);

  //로컬 스토리지에 데이터 삭제 removeItem
  window.localStorage.removeItem('name');
  */


  /*
  let obj = {id:1, text:'learn web'}
  console.log(obj);//{id: 1, text: 'learn web'}
  
  //객체 -> JSON 문자열, JSON.stringify(대상) 
  let objString = JSON.stringify(obj);
  console.log(objString);//'{"id":1,"text":"learn web"}'
  
  //로컬스토리지에는 문자열만 쓰기 가능
  window.localStorage.setItem('todo', objString);

  let test = window.localStorage.getItem('todo');
  //JSON 문자열 -> 객체 JSON.parse(대상) 다시 문자열을 객체로 바꿀 필요가 있음 JSON.parse(대상)
  let testObj = JSON.parse(test)
  console.log(testObj.text);
  */

  const [todo, setTodo] = useState([])//빈배열
  const [todoId, setTodoId] = useState(0);
  console.log(todoId);
  //0으로 넣었더니 마지막 id값을 가져와서 거기에 +1을 한 값을 id값으로 변경해보기


  /*
  let obj = [{id:1, text:'learn web'}]
  let objString = JSON.stringify(obj);
  window.localStorage.setItem('todo', objString);
  */

  let getTodoList = useCallback(() => {
    console.log('getTodoList 실행');


    //useCallback 리액트 훅, 불필요한 렌더링방지, 동일함수 재사용 //함수안에 함수가 또 있는 것=callback함수


    const todoStringFromLocalStorage = window.localStorage.getItem('todo');
    if (todoStringFromLocalStorage !== null && todoStringFromLocalStorage !== '[]') {
      //값이 있으면, 비어있지 않다면 // 값이 들어갔다가 나오는 경우 빈 배열 []대괄호만 남기도 함
      //JSON 문자열 -> 객체 JSON.parse(대상)
      const todoObj = JSON.parse(todoStringFromLocalStorage)
      setTodo(todoObj);
      setTodoId(todoObj[todoObj.length - 1].id);

    }
  }, []); // useCallback함수로 getTodoList 함수의 결과 변경되었는지 여부를 알려줌




  let updatetodoid = useCallback(() => {
    console.log('updatetodoid 실행');
    if (todo.length > 0) {
      setTodoId(todo[todo.length - 1].id);
    } else {
      setTodoId(0);
    }
  }, [todo]);
  /*
  let setStorage = () => {
    console.log('setStorage 실행');

    let objString = JSON.stringify(todo);
    window.localStorage.setItem('todo', objString);
  };*/

    let setStorage = useCallback(()=>{
      console.log('setStorage 실행');
      
      let todoString = JSON.stringify(todo);
      window.localStorage.setItem('todo', todoString); 
    },[todo]);

  //로컬 스토리지에서 todo라는 key의 값이 있으면 그걸 조회해서->todo의 목록으로 저장
  useEffect(() => {//최초 한번 실행, getTodoList객체변경되면 getTodoList다시 실행
    getTodoList();
  }, [getTodoList]) //todo들어오면 무한루프


  useEffect(() => {
    setStorage();
  }, [setStorage])  //최초 한번 실행, setStorage 객체 변경되면 실행

  useEffect(() => {
    updatetodoid();
  }, [todo, updatetodoid])  //최초 한번 실행, todo/updatetodoid 변경되면 실행




  let addTodo = (value) => {
    console.log('addTodo 실행');
    let newTodos = [...todo];
    let newId = todoId + 1;
    setTodoId(newId);
    newTodos.push({ id: newId, text: value, checked: false });
    setTodo(newTodos);
    document.querySelector('#todo').value = '';

  }

  let checkUpdate = (id, value) => {
    console.log('checkUpdate 실행');
    //console.log(id,value);

    let newTodos = todo.map(item => item.id === id ? { ...item, checked: value } : item);
    setTodo(newTodos);
  }

  let deleteTodo = (id) => {
    console.log('deleteTodo 실행');
    
    let newTodos = [...todo];
    let idx = newTodos.findIndex(item => item.id === id);
    newTodos.splice(idx, 1);
    setTodo(newTodos);
    console.log(todoId);
  }
  //배열에서 값 제거, arr.push(값) arr.shift(값) 첫째제거 arr.unshift() 마지막제거=pop()
  //arr.slice(1,3) 은 복사
  //특정부위 제거는 arr.splice(1시작번호,3없앨 갯수)
  
  let updateTodo = (id,text)=>{
    let newTodos = todo.map(item => item.id === id ? { ...item, text:text } : item);
    setTodo(newTodos);
  }

  let todos = todo.map((item, idx) =>
    <Todo data={item} key={idx} updateTodo={updateTodo} checkUpdate={checkUpdate} deleteTodo={deleteTodo} />)

  return (
    <div className="container">
      <h1>To do List 할 일</h1>
      <Form onSubmit={(e) => {
        e.preventDefault();
        //console.log(e.target.todo.value)
        addTodo(e.target.todo.value);
      }}>
        <Form.Group className="mb-3" controlId="todo">
          <Form.Label>할 일 입력</Form.Label>
          <Form.Control type="text" name="todo" placeholder="할 일을 입력하거라!" />
        </Form.Group>
        <Button type="submit" variant="dark">입력</Button>
      </Form>
      <hr />
      <div>
        {todos}
      </div>
    </div>
  );
}

export default App;
