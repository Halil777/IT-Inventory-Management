
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getEmployees } from '../services/employees';
import { Employee } from '../interfaces/Employee';
import ListItem from '../components/ListItem';

const EmployeesScreen = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={employees}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.name}
          subtitle={item.email}
        />
      )}
    />
  );
};

export default EmployeesScreen;
