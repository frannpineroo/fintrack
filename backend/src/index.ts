import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import groupRoutes from './routes/group.routes';
import expenseRoutes from './routes/expense.routes';

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

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Fintrack API corriendo ' })
})

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)

    socket.on('join_group', (groupId: number) => {
        socket.join(`group_${groupId}`)
        console.log(`Socket ${socket.id} se unió al grupo ${groupId}`)
    })

    socket.on('leave_group', (groupId: number) => {
        socket.leave(`group_${groupId}`)
        console.log(`Socket ${socket.id} dejó el grupo ${groupId}`)
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id)
    })
})

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})

export { io };