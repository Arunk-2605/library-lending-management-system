import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import MemberDashboard from './pages/Member/Dashboard';
import BookSearch from './pages/Member/Books';
import MemberLoans from './pages/Member/Loans';
import MemberReservations from './pages/Member/Reservations';
import MemberFines from './pages/Member/Fines';
import MemberAccount from './pages/Member/Account';
import LibrarianDashboard from './pages/Librarian/Dashboard';
import ManageBooks from './pages/Librarian/ManageBooks';
import ManageCopies from './pages/Librarian/ManageCopies';
import AllLoans from './pages/Librarian/AllLoans';
import ProcessReturns from './pages/Librarian/ProcessReturns';
import FinePayments from './pages/Librarian/FinePayments';
import LibrarySettings from './pages/Librarian/LibrarySettings';
import Sidebar from './components/Sidebar';
import { useUserRole } from './hooks/useUserRole';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {user && <Sidebar role={role} />}
      <div className="flex-1 p-4 overflow-auto">
        <Routes>
          {/* Auth */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
          {/* Member */}
          <Route path="/member/dashboard" element={user && role === 'member' ? <MemberDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/member/books" element={user && role === 'member' ? <BookSearch /> : <Navigate to="/login" replace />} />
          <Route path="/member/loans" element={user && role === 'member' ? <MemberLoans /> : <Navigate to="/login" replace />} />
          <Route path="/member/reservations" element={user && role === 'member' ? <MemberReservations /> : <Navigate to="/login" replace />} />
          <Route path="/member/fines" element={user && role === 'member' ? <MemberFines /> : <Navigate to="/login" replace />} />
          <Route path="/member/account" element={user && role === 'member' ? <MemberAccount /> : <Navigate to="/login" replace />} />
          {/* Librarian */}
          <Route path="/librarian/dashboard" element={user && role === 'librarian' ? <LibrarianDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/librarian/books" element={user && role === 'librarian' ? <ManageBooks /> : <Navigate to="/login" replace />} />
          <Route path="/librarian/copies" element={user && role === 'librarian' ? <ManageCopies /> : <Navigate to="/login" replace />} />
          <Route path="/librarian/loans" element={user && role === 'librarian' ? <AllLoans /> : <Navigate to="/login" replace />} />
          <Route path="/librarian/returns" element={user && role === 'librarian' ? <ProcessReturns /> : <Navigate to="/login" replace />} />
          <Route path="/librarian/fines" element={user && role === 'librarian' ? <FinePayments /> : <Navigate to="/login" replace />} />
          <Route path="/librarian/settings" element={user && role === 'librarian' ? <LibrarySettings /> : <Navigate to="/login" replace />} />
          {/* Default redirect */}
          <Route
            path="/"
            element={
              user ? (
                role === 'librarian' ? (
                  <Navigate to="/librarian/dashboard" replace />
                ) : (
                  <Navigate to="/member/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<div>404 – Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
