import './App.css';
import { TodoWrapper } from './components/todos/TodoWrapper';
import { motion } from 'framer-motion';


function App() {
  return (
    <motion.div 
    layout 
    transition={{ duration: 0.5}}
    className="App">
        <TodoWrapper />
    </motion.div>
  );
}

export default App;
