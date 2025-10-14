
import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Employee } from '../interfaces/Employee';
import { getEmployees } from '../services/employees';

const EmployeesScreen = () => (
  <DataList<Employee>
    fetcher={getEmployees}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading employees..."
    errorMessage="Error loading employees:"
    emptyMessage="No employees found."
    renderItem={({ item }) => (
      <ListItem
        title={item.name}
        subtitle={`Email: ${item.email} • Department: ${item.department?.name ?? 'Unassigned'}`}
      />
    )}
  />
);

export default EmployeesScreen;
