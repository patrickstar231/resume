import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import App from './App.jsx';

export function render(path, year) {
  return renderToString(<StaticRouter location={path}><App year={year} /></StaticRouter>);
}
