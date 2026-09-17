import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/manrope';
import '@fontsource-variable/bodoni-moda';
import './index.css';
import App from './App.jsx';

const root = document.getElementById('root');
const year = Number(document.documentElement.dataset.buildYear) || new Date().getFullYear();
const app = <React.StrictMode><BrowserRouter><App year={year} /></BrowserRouter></React.StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
