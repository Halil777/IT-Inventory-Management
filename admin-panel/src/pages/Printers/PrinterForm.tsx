import { Form, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../../services/departments";

const { Option } = Select;

const PrinterForm = ({ form }) => {
  const { t } = useTranslation();
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[{ required: true, message: t("Please input the name!") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ipAddress"
        label={t("IP Address")}
        rules={[{ required: true, message: t("Please input the IP address!") }]}
      >
        <Input />
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
    </Form>
  );
};

export default PrinterForm;
