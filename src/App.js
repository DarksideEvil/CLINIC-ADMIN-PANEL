import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AllRouters from './router/allRouter';
import "rsuite/dist/rsuite.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <AllRouters />
      </BrowserRouter>
    </>
  );
}

export default App;
