// src/components/AdminLogs.js
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import userServices from '../../services/userService';
import { AdminAppBar } from '../AppBar/AdminAppBar';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await userServices.getLogs();
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Failed to load logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <AdminAppBar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Activity Logs</h1>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Username</th>
                <th style={styles.tableHeaderCell}>Role</th>
                <th style={styles.tableHeaderCell}>URL</th>
                <th style={styles.tableHeaderCell}>Method</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                  <td style={styles.tableCell}>{log.username}</td>
                  <td style={styles.tableCell}>{log.role}</td>
                  <td style={styles.tableCell}>{log.url}</td>
                  <td style={styles.tableCell}>{log.method}</td>
                  <td style={styles.tableCell}>{log.status}</td>
                  <td style={styles.tableCell}>{new Date(log.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#e8f5e9', // Light green background
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2e7d32', // Darker green for contrast
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#66bb6a', // Green header
  },
  tableHeaderCell: {
    padding: '10px 15px',
    textAlign: 'left',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  tableRowEven: {
    backgroundColor: '#f1f8e9', // Lighter green for even rows
  },
  tableRowOdd: {
    backgroundColor: '#ffffff', // White for odd rows
  },
  tableCell: {
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'red',
  },
};

export default AdminLogs;
