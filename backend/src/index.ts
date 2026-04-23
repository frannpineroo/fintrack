import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Fintrack API corriendo ' })
})

io.on('connection', (socket) => {
    console.log("Nuevo cliente conectado:" + socket.id);
    socket.on('disconnect', () => {
        console.log("Cliente desconectado:" + socket.id);
    })
})

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})

export { io };