import type { FC } from 'react';
import { Space, Input, Select, Button } from 'antd';

interface SelectOption {
  label: string;
  value: string;
}

interface PrinterFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  departmentOptions: SelectOption[];
  departmentValue: string;
  onDepartmentChange: (value: string) => void;
  departmentLabel: string;
  assignmentOptions: SelectOption[];
  assignmentValue: string;
  onAssignmentChange: (value: string) => void;
  assignmentLabel: string;
  onReset: () => void;
  resetLabel: string;
  disabled?: boolean;
}

const PrinterFilters: FC<PrinterFiltersProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  departmentOptions,
  departmentValue,
  onDepartmentChange,
  departmentLabel,
  assignmentOptions,
  assignmentValue,
  onAssignmentChange,
  assignmentLabel,
  onReset,
  resetLabel,
  disabled,
}) => (
  <Space
    direction="horizontal"
    size={[16, 16]}
    wrap
    style={{ marginBottom: 16, width: '100%' }}
  >
    <Input
      allowClear
      placeholder={searchPlaceholder}
      value={searchValue}
      onChange={(event) => onSearchChange(event.target.value)}
      style={{ maxWidth: 260 }}
      disabled={disabled}
    />
    <Select
      value={departmentValue}
      onChange={onDepartmentChange}
      options={departmentOptions}
      style={{ minWidth: 200 }}
      aria-label={departmentLabel}
      disabled={disabled}
    />
    <Select
      value={assignmentValue}
      onChange={onAssignmentChange}
      options={assignmentOptions}
      style={{ minWidth: 200 }}
      aria-label={assignmentLabel}
      disabled={disabled}
    />
    <Button onClick={onReset} disabled={disabled}>
      {resetLabel}
    </Button>
  </Space>
);

export default PrinterFilters;
