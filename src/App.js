import { useReducer } from 'react';
import './style.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

// SYMBOL
export const actions = {
  add_digit: 'add-digit',
  choose_operation: 'choose-operation',
  clear: 'clear',
  delete_digit: 'delete-digit',
  evaluate: 'evaluate'
};

// CONDITIONS

function reducer(state, {type, payload}) {
  switch(type){
    case actions.add_digit:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };

    case actions.choose_operation: 
      if(state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation
        }
      }

      if(state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
      
    case actions.clear :
      return{};

    case actions.delete_digit:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state;
      if(state.currentOperand.length === 1){
        return{...state, currentOperand: null}
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }

    case actions.evaluate:
      if(
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ){
        return state
      }

      return{
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

      default: break;
  }
};

// ASSESS

function evaluate({currentOperand, previousOperand, operation}){
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if(isNaN(prev) || isNaN(current)) return ""
    let computation = "";

    switch(operation){
      case "+": 
      computation = prev + current
        break
      case "-": 
      computation = prev - current
        break
      case "*": 
      computation = prev * current
        break
      case "/": 
      computation = prev / current
        break
      default: break;
      
    }
      return computation.toString();
  };

// MAIN

function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,{});

  return (
    <>
      <div className='container'>
      <div className='calculator'>
        <div className='output'>
          <div className='previous-operand'>{previousOperand} {operation}</div>
          <div className='current-operand'>{currentOperand}</div>
        </div>
        <button className='deleted equal' onClick={() => dispatch({type: actions.clear})}>AC</button>
        <button className='none'></button>
        <button className='deleted' onClick={() => dispatch({type: actions.delete_digit})}>DEL</button>
        <OperationButton operation={"/"} dispatch={dispatch}/>
        <DigitButton digit={"7"} dispatch={dispatch}/>
        <DigitButton digit={"8"} dispatch={dispatch}/>
        <DigitButton digit={"9"} dispatch={dispatch}/>
        <OperationButton operation={"*"} dispatch={dispatch}/>
        <DigitButton digit={"4"} dispatch={dispatch}/>
        <DigitButton digit={"5"} dispatch={dispatch}/>
        <DigitButton digit={"6"} dispatch={dispatch}/>
        <OperationButton operation={"-"} dispatch={dispatch}/>
        <DigitButton digit={"1"} dispatch={dispatch}/>
        <DigitButton digit={"2"} dispatch={dispatch}/>
        <DigitButton digit={"3"} dispatch={dispatch}/>
        <OperationButton operation={"+"} dispatch={dispatch}/>
        <OperationButton operation={"."} dispatch={dispatch}/>
        <DigitButton digit={"0"} dispatch={dispatch}/>
        <button className='equal' onClick={() => dispatch({type: actions.evaluate})}>=</button>
      </div>
    </div>
    </>
  );
}

export default App;
