import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Department } from '../interfaces/Department';
import { getDepartments } from '../services/departments';

const DepartmentsScreen = () => (
  <DataList<Department>
    fetcher={getDepartments}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading departments..."
    errorMessage="Error loading departments:"
    emptyMessage="No departments available."
    renderItem={({ item }) => (
      <ListItem
        title={item.name}
        subtitle={`Head: ${item.head ?? 'N/A'}${item.description ? ` • ${item.description}` : ''}`}
      />
    )}
  />
);

export default DepartmentsScreen;

