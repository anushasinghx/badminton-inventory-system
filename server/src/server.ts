import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import analyticsRouter from './routes/analytics';
import historyRouter from './routes/history';
import exportRouter from './routes/export';
import { inventoryService } from './services/inventoryService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


inventoryService.initializeSampleData();


app.use('/api/products', productsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/history', historyRouter);
app.use('/api/export', exportRouter);

//check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      products: '/api/products',
      analytics: '/api/analytics',
      history: '/api/history',
      export: '/api/export'
    }
  });
});

//API Documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'Inventory Management System API',
    version: '1.0.0',
    endpoints: {
      products: {
        GET: '/api/products',
        POST: '/api/products',
        PUT: '/api/products/:id',
        DELETE: '/api/products/:id'
      },
      analytics: {
        GET: '/api/analytics'
      },
      history: {
        GET: '/api/history'
      },
      export: {
        CSV: '/api/export/csv',
        JSON: '/api/export/json'
      }
    }
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});


app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});


process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`
  
  
  📊 API Endpoints:
     Health Check: GET    http://localhost:${PORT}/api/health
     Products:     GET    http://localhost:${PORT}/api/products
     Analytics:    GET    http://localhost:${PORT}/api/analytics
     History:      GET    http://localhost:${PORT}/api/history
     Export CSV:   GET    http://localhost:${PORT}/api/export/csv
     Export JSON:  GET    http://localhost:${PORT}/api/export/json
     Doneeeeeeeee
  `);
});

export default app;