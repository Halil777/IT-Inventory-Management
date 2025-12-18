import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { exportRowsToXlsx } from '../lib/xlsxExport';

interface ExcelExportButtonProps<T extends object> {
  data?: T[];
  columns: ColumnsType<T>;
  fileName: string;
  isLoading?: boolean;
}

const ExcelExportButton = <T extends object>({
  data,
  columns,
  fileName,
  isLoading = false,
}: ExcelExportButtonProps<T>) => {
  const { t } = useTranslation();

  const exportableColumns = useMemo(() => {
    return columns.flatMap((column) => {
      if (!('dataIndex' in column) || typeof column.dataIndex !== 'string') {
        return [];
      }

      const fallbackKey = (column.key as string | undefined) ?? column.dataIndex;
      const title = column.title as ReactNode | ((...args: unknown[]) => ReactNode) | undefined;
      const header = typeof title === 'string' ? title : String(fallbackKey);

      return [{ key: column.dataIndex, header }];
    });
  }, [columns]);

  const handleExport = () => {
    if (!data || data.length === 0 || exportableColumns.length === 0) {
      return;
    }

    const exportRows = data.map((row) => {
      const formattedRow: Record<string, unknown> = {};
      exportableColumns.forEach(({ key }) => {
        formattedRow[key] = (row as Record<string, unknown>)[key];
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
