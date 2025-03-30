import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Alert,
  Popconfirm,
  Card,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Voucher {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchaseAmount?: number;
  maxUsage?: number;
  usageCount: number;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  customerRestriction?: "new" | "existing" | "all";
}

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch("/api/vouchers");
        if (!response.ok) {
          throw new Error("Failed to fetch vouchers");
        }
        const data = await response.json();
        setVouchers(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load vouchers");
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        setLoading(true);
        const response = await fetch(`/api/vouchers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete voucher");
        }

        setVouchers(vouchers.filter((voucher) => voucher.id !== id));
      } catch (err) {
        setError("Failed to delete voucher");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const columns: ColumnsType<Voucher> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      ellipsis: true,
      render: (text: string) => (
        <Typography.Text strong>{text}</Typography.Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (_: any, record: Voucher) =>
        record.type === "percentage" ? `${record.value}%` : `$${record.value}`,
    },
    {
      title: "Usage",
      key: "usage",
      responsive: ['md'],
      render: (_: any, record: Voucher) =>
        `${record.usageCount} / ${record.maxUsage || "∞"}`,
    },
    {
      title: "Valid Period",
      key: "period",
      responsive: ['lg'],
      render: (_: any, record: Voucher) =>
        `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`,
    },
    {
      title: "Status",
      key: "status",
      responsive: ['sm'],
      render: (_: any, record: Voucher) => (
        <Tag color={record.active ? "success" : "default"}>
          {record.active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 100,
      render: (_: any, record: Voucher) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/vouchers/edit/${record.id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this voucher?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={5}>Vouchers</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/vouchers/new")}
        >
          Create Voucher
        </Button>
      </div>

      {error && (
        <Alert message={error} type="error" style={{ marginBottom: 16 }} />
      )}

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        locale={{ emptyText: "No vouchers found" }}
        loading={loading}
        scroll={{ x: 800, scrollToFirstRowOnChange: true }}
        size="small"
        sticky
      />
    </Card>
  );
};

export default VoucherList;
