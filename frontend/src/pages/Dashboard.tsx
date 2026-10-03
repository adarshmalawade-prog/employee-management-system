import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  HealthCheckResponse,
  NotificationMessage,
} from '../types/employee';
import { employeeApi, ApiError } from '../services/employeeApi';
import { Navbar } from '../components/Navbar';
import { StatsCards } from '../components/StatsCards';
import { SearchBar } from '../components/SearchBar';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeModal } from '../components/EmployeeModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { NotificationToast } from '../components/NotificationToast';

export const Dashboard: React.FC = () => {
  // Data States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployeesForOptions, setAllEmployeesForOptions] = useState<Employee[]>([]);
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);

  // Status States
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(false);
  const [tableError, setTableError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [role, setRole] = useState<string>('');

  // Modal States
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState<boolean>(false);
  const [modalServerError, setModalServerError] = useState<string | null>(null);

  // Delete Dialog States
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Check Backend Health
  const checkBackendHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const res = await employeeApi.checkHealth();
      setHealth(res);
    } catch {
      setHealth({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: 0,
        services: {
          api: 'down',
          database: 'disconnected',
          error: 'Backend API unreachable',
        },
      });
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  // Fetch Employees List from API
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setTableError(null);
    try {
      const data = await employeeApi.getEmployees({
        search,
        department,
        role,
      });
      setEmployees(data);

      // If no filters active, update the master options set for department/role dropdowns
      if (!search && !department && !role) {
        setAllEmployeesForOptions(data);
      }
    } catch (err: any) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Unable to connect to the Employee Management API. Please check your backend connection.';
      setTableError(msg);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [search, department, role]);

  // Initial Load
  useEffect(() => {
    checkBackendHealth();
    fetchEmployees();
  }, [checkBackendHealth, fetchEmployees]);

  // Derive unique department & role filter dropdown options
  const departmentOptions = useMemo(() => {
    const depts = new Set(
      allEmployeesForOptions
        .map((e) => e.department)
        .filter((d) => Boolean(d && d.trim()))
    );
    return Array.from(depts).sort();
  }, [allEmployeesForOptions]);

  const roleOptions = useMemo(() => {
    const roles = new Set(
      allEmployeesForOptions
        .map((e) => e.role)
        .filter((r) => Boolean(r && r.trim()))
    );
    return Array.from(roles).sort();
  }, [allEmployeesForOptions]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearch('');
    setDepartment('');
    setRole('');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setSelectedEmployee(null);
    setModalServerError(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalServerError(null);
    setModalOpen(true);
  };

  // Handle Form Submit (Create / Edit)
  const handleModalSubmit = async (
    data: CreateEmployeeInput | UpdateEmployeeInput
  ) => {
    setModalSubmitting(true);
    setModalServerError(null);

    try {
      if (selectedEmployee) {
        // Edit Mode (PUT)
        await employeeApi.updateEmployee(selectedEmployee.id, data);
        addNotification(
          'success',
          `Employee "${data.first_name || selectedEmployee.first_name} ${
            data.last_name || selectedEmployee.last_name
          }" updated successfully.`
        );
      } else {
        // Add Mode (POST)
        const newEmp = await employeeApi.createEmployee(
          data as CreateEmployeeInput
        );
        addNotification(
          'success',
          `Employee "${newEmp.first_name} ${newEmp.last_name}" (${newEmp.employee_id}) added successfully.`
        );
      }

      setModalOpen(false);
      fetchEmployees();
      checkBackendHealth();
    } catch (err: any) {
      setModalServerError(err.message || 'An error occurred while saving.');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
      await employeeApi.deleteEmployee(employeeToDelete.id);
      addNotification(
        'success',
        `Employee "${employeeToDelete.first_name} ${employeeToDelete.last_name}" (${employeeToDelete.employee_id}) deleted.`
      );
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
      checkBackendHealth();
    } catch (err: any) {
      addNotification(
        'error',
        err.message || 'Failed to delete employee record.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        health={health}
        checkingHealth={checkingHealth}
        onRefreshHealth={() => {
          checkBackendHealth();
          fetchEmployees();
        }}
      />

      {/* Main Dashboard View */}
      <main className="main-content">
        {/* Dynamic Statistics Cards */}
        <StatsCards employees={allEmployeesForOptions.length > 0 ? allEmployeesForOptions : employees} />

        {/* Content Section: Controls Bar & Table */}
        <div className="content-card">
          <SearchBar
            search={search}
            department={department}
            role={role}
            departmentOptions={departmentOptions}
            roleOptions={roleOptions}
            onSearchChange={setSearch}
            onDepartmentChange={setDepartment}
            onRoleChange={setRole}
            onResetFilters={handleResetFilters}
            onOpenAddModal={handleOpenAddModal}
          />

          <EmployeeTable
            employees={employees}
            loading={loading}
            hasError={Boolean(tableError)}
            errorMessage={tableError || undefined}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onRetry={() => {
              checkBackendHealth();
              fetchEmployees();
            }}
          />
        </div>
      </main>

      {/* Add / Edit Employee Dialog */}
      <EmployeeModal
        isOpen={modalOpen}
        employee={selectedEmployee}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        submitting={modalSubmitting}
        serverError={modalServerError}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        employee={employeeToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      {/* Floating Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
};
