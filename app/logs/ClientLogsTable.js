'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  LogIn, LogOut, Clock, User, Mail, Shield, ChevronRight,
  X, CheckCircle2, XCircle, Lock, Search, ChevronLeft,
  ChevronDown, ChevronUp, ChevronsUpDown, ExternalLink
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/services/api';

// ---------- helpers ----------
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
}

function calcDuration(loginTime, logoutTime) {
  if (!loginTime || !logoutTime) return null;
  const ms = new Date(logoutTime) - new Date(loginTime);
  if (ms < 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getInitials(row) {
  const name = row.user_name || row.email || `User ${row.user_master_id}`;
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(userId) {
  const palette = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
  ];
  return palette[userId % palette.length];
}

function LoginAttemptBadge({ value }) {
  if (value === 'success') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Success
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <XCircle className="h-3 w-3" /> Failure
    </span>
  );
}

// ---------- Detail Modal ----------
function UserDetailModal({ userId, userName, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/get-activity-logs/${userId}`);
        if (res && res.status === 'success' && Array.isArray(res.data)) {
          setLogs(res.data);
        } else {
          setError('Failed to load user logs.');
        }
      } catch {
        setError('An error occurred while fetching logs.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const successCount = logs.filter(l => l.login_attempt === 'success').length;
  const failCount = logs.filter(l => l.login_attempt === 'failure').length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="gradient-header px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(userId)}`}>
              {(userName || `U${userId}`).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-tight">
                {userName || `User ${userId}`}
              </p>
              <p className="text-blue-200 text-xs mt-0.5">User ID: {userId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white rounded-full hover:bg-white/20 p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats strip */}
        {!loading && !error && (
          <div className="grid grid-cols-3 border-b border-border bg-muted/30 flex-shrink-0">
            <div className="px-5 py-3 border-r border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Sessions</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{logs.length}</p>
            </div>
            <div className="px-5 py-3 border-r border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Successful</p>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">{successCount}</p>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Failed</p>
              <p className="text-2xl font-bold text-red-500 mt-0.5">{failCount}</p>
            </div>
          </div>
        )}

        {/* Log list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading && (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-3" />
              Loading sessions…
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}
          {!loading && !error && logs.length === 0 && (
            <div className="text-center text-muted-foreground py-12">No sessions found for this user.</div>
          )}
          {!loading && !error && logs.map((log) => {
            const duration = calcDuration(log.login_time, log.logout_time);
            const isSuccess = log.login_attempt === 'success';
            return (
              <div
                key={log.user_activity_log_id}
                className="rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${isSuccess ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <LoginAttemptBadge value={log.login_attempt} />
                        {log.logout_time === null && isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
                            <Clock className="h-3 w-3" /> Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                        <LogIn className="h-3 w-3" />
                        <span className="font-mono">{formatDate(log.login_time)}</span>
                      </div>
                      {log.logout_time && (
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <LogOut className="h-3 w-3" />
                          <span className="font-mono">{formatDate(log.logout_time)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {duration && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                        <Clock className="h-3 w-3" /> {duration}
                      </span>
                    )}
                    <p className="text-[10px] text-muted-foreground font-mono mt-1.5 truncate max-w-[160px]" title={log.session_id}>
                      {log.session_id?.slice(0, 8)}…
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ---------- Main Table ----------
const ITEMS_PER_PAGE = 10;

export default function ClientLogsTable({ data }) {
  const [search, setSearch] = useState('');
  const [filterAttempt, setFilterAttempt] = useState('all'); // 'all' | 'success' | 'failure'
  const [sortConfig, setSortConfig] = useState({ key: 'user_activity_log_id', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null); // { userId, userName }

  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return prev.direction === 'asc'
          ? { key, direction: 'desc' }
          : { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
      : <ChevronDown className="h-3.5 w-3.5 text-blue-500" />;
  };

  const filtered = useMemo(() => {
    let result = data;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(row =>
        (row.user_name || '').toLowerCase().includes(q) ||
        (row.email || '').toLowerCase().includes(q) ||
        String(row.user_master_id).includes(q) ||
        (row.session_id || '').toLowerCase().includes(q) ||
        (row.app_session_id || '').toLowerCase().includes(q)
      );
    }

    if (filterAttempt !== 'all') {
      result = result.filter(row => row.login_attempt === filterAttempt);
    }

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let va = a[sortConfig.key];
        let vb = b[sortConfig.key];
        if (va == null) va = '';
        if (vb == null) vb = '';
        if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
        if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, filterAttempt, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  React.useEffect(() => { setCurrentPage(1); }, [search, filterAttempt]);

  const totalSuccess = data.filter(r => r.login_attempt === 'success').length;
  const totalFailure = data.filter(r => r.login_attempt === 'failure').length;
  const activeSessions = data.filter(r => r.login_attempt === 'success' && !r.logout_time).length;

  const SortHeader = ({ label, colKey }) => (
    <button
      onClick={() => handleSort(colKey)}
      className="flex items-center gap-1 hover:text-foreground transition-colors outline-none cursor-pointer"
    >
      {label}
      <SortIcon colKey={colKey} />
    </button>
  );

  return (
    <>
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Events', value: data.length, color: 'text-foreground', bg: 'bg-muted/40' },
          { label: 'Successful', value: totalSuccess, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Failed', value: totalFailure, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Active Sessions', value: activeSessions, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-lg border border-border px-4 py-3 ${bg}`}>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search by username, email, or session ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'failure'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilterAttempt(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border capitalize ${
                filterAttempt === opt
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {opt === 'all' ? 'All' : opt === 'success' ? '✓ Success' : '✗ Failure'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px] tracking-wide">
              <tr>
                <th className="h-11 px-4 font-medium">
                  <SortHeader label="User" colKey="user_name" />
                </th>
                <th className="h-11 px-4 font-medium hidden md:table-cell">
                  <SortHeader label="Login Time" colKey="login_time" />
                </th>
                <th className="h-11 px-4 font-medium hidden lg:table-cell">
                  Logout Time
                </th>
                <th className="h-11 px-4 font-medium hidden lg:table-cell">
                  Duration
                </th>
                <th className="h-11 px-4 font-medium">
                  <SortHeader label="Attempt" colKey="login_attempt" />
                </th>
                <th className="h-11 px-4 font-medium hidden sm:table-cell">
                  Session
                </th>
                <th className="h-11 px-4 font-medium text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-foreground">
                    No activity logs match your search.
                  </td>
                </tr>
              ) : paginated.map((row) => {
                const duration = calcDuration(row.login_time, row.logout_time);
                const isActive = row.login_attempt === 'success' && !row.logout_time;
                const displayName = row.user_name || `User ${row.user_master_id}`;
                return (
                  <tr
                    key={row.user_activity_log_id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${getAvatarColor(row.user_master_id)}`}>
                          {getInitials(row)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{displayName}</p>
                          {row.email && (
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              {row.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Login Time */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-xs text-slate-600">{formatDate(row.login_time)}</span>
                    </td>

                    {/* Logout Time */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {row.logout_time ? (
                        <span className="font-mono text-xs text-slate-600">{formatDate(row.logout_time)}</span>
                      ) : isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {duration ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="h-3 w-3" /> {duration}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Attempt */}
                    <td className="px-4 py-3">
                      <LoginAttemptBadge value={row.login_attempt} />
                    </td>

                    {/* Session */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-mono text-[11px] text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded" title={row.session_id}>
                        {row.session_id?.slice(0, 8) || '—'}…
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedUser({ userId: row.user_master_id, userName: displayName })}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                        title={`View all logs for ${displayName}`}
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground font-medium">
          Showing{' '}
          <span className="text-foreground">
            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
          </span>{' '}
          to{' '}
          <span className="text-foreground">
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
          </span>{' '}
          of{' '}
          <span className="text-foreground">{filtered.length}</span> entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold px-2">
            {currentPage}{' '}
            <span className="text-muted-foreground font-normal">/ {totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <UserDetailModal
          userId={selectedUser.userId}
          userName={selectedUser.userName}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
