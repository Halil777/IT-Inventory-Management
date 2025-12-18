import { Form, Input, Select } from "antd";
import type { FormInstance } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../../services/departments";
import { getEmployees } from "../../services/employees";

const { Option } = Select;

interface DepartmentOption {
  id: number;
  name: string;
}

interface EmployeeOption {
  id: number;
  name: string;
}

interface PrinterFormProps {
  form: FormInstance;
}

const PrinterForm = ({ form }: PrinterFormProps) => {
  const { t } = useTranslation();
  const { data: departments, isLoading: isLoadingDepartments } = useQuery<DepartmentOption[]>({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
  const { data: employees, isLoading: isLoadingEmployees } = useQuery<EmployeeOption[]>({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[{ required: true, message: t("Please input the printer name!") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="model"
        label={t("Model")}
        rules={[{ required: true, message: t("Please input the model!") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label={t("Description")}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="departmentId"
        label={t("Department")}
        rules={[{ required: true, message: t("Please select a department!") }]}
      >
        <Select loading={isLoadingDepartments}>
          {departments?.map((department) => (
            <Option key={department.id} value={department.id}>
              {department.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="userId"
        label={t("Used By")}
      >
        <Select loading={isLoadingEmployees} allowClear>
          {employees?.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default PrinterForm;
