import { createBrowserRouter } from 'react-router-dom';
import StartPage from './views/StartPage';
import InstanceView from './views/InstanceView';
import ResultsDisplay from './components/ResultsDisplay';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/game/:difficulty',
    element: <InstanceView />,
  },
  {
    path: '/results',
    element: <ResultsDisplay />,
  },
]); 