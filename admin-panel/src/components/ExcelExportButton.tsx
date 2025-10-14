import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ReactNode, useMemo } from 'react';
import { exportRowsToXlsx } from '../lib/xlsxExport';

interface TableColumn {
  title: ReactNode;
  dataIndex?: string;
  key?: string;
}

interface ExcelExportButtonProps<T extends Record<string, unknown>> {
  data?: T[];
  columns: TableColumn[];
  fileName: string;
  isLoading?: boolean;
}

const ExcelExportButton = <T extends Record<string, unknown>>({
  data,
  columns,
  fileName,
  isLoading = false,
}: ExcelExportButtonProps<T>) => {
  const { t } = useTranslation();

  const exportableColumns = useMemo(
    () =>
      columns
        .filter((column) => typeof column.dataIndex === 'string')
        .map((column) => {
          const fallbackKey = (column.key as string | undefined) ?? (column.dataIndex as string | undefined) ?? '';
          return {
            key: column.dataIndex as string,
            header: typeof column.title === 'string' ? column.title : String(fallbackKey),
          };
        }),
    [columns],
  );

  const handleExport = () => {
    if (!data || data.length === 0 || exportableColumns.length === 0) {
      return;
    }

    const exportRows = data.map((row) => {
      const formattedRow: Record<string, unknown> = {};
      exportableColumns.forEach(({ key }) => {
        formattedRow[key] = row[key];
      });
      return formattedRow;
    });

    exportRowsToXlsx(exportRows, exportableColumns, fileName);
  };

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={handleExport}
      disabled={isLoading || !data?.length}
    >
      {t('Export to Excel')}
    </Button>
  );
};

export default ExcelExportButton;
