import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/auth.service";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChatRoomPage from "./pages/Chat";
import Header from "./components/Header";

function PrivateRoute({ children }: { children: React.ReactNode }) {
    if (!authService.isAuthenticated()) {
        return <Navigate to='/login' />;
    }
    return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    if (authService.isAuthenticated()) {
        return <Navigate to='/' />;
    }
    return <>{children}</>;
}

export default function App() {
    return (
        <Router>
            <div className='min-h-screen bg-gray-950 text-white'>
                <Header />
                <main className='pt-20'>
                    <Routes>
                        <Route
                            path='/'
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path='/chat/:roomId'
                            element={
                                <PrivateRoute>
                                    <ChatRoomPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path='/login'
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
