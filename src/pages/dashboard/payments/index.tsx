import { Button } from "@/components/Button";
import "./_style.scss";
import { PaymentService } from "@/services/payment";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import Pagination from "@/components/Pagination";
import {
  IPaymentForm,
  ModalCreatePayment,
} from "./components/modalCreatePayment";
import { formatDate, numberToCurrency } from "@/utils/formatters";

interface IPagination {
  page: number;
  pageSize: number;
}

interface IFilters {
  searchBy: string;
}

export const PagePayments = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<IFilters>({
    searchBy: "",
  });

  const paymentsSWRKey = useMemo(() => {
    return `/payments/${JSON.stringify(filters)}&${JSON.stringify(pagination)}`;
  }, [filters, pagination]);

  const fetchPayments = useCallback(
    async (pagination: IPagination, filters: IFilters) => {
      const { data } = await PaymentService.getPayments({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      const res = data.data;
      setTotalItems(res.pagination.total);

      return res.items;
    },
    []
  );

  const paymentsSWR = useSWR(paymentsSWRKey, () =>
    fetchPayments(pagination, filters)
  );

  const [modalCreate, setModalCreate] = useState<{ visible: boolean }>({
    visible: false,
  });

  const onCreatePayment = async (form: IPaymentForm) => {
    try {
      await PaymentService.createPayment({
        categoryId: form.category.id,
        description: form.description,
        paymentDate: form.paymentDate,
        status: form.status,
        paymentMethod: form.paymentMethod,
        value: parseFloat(form.value),
        observation: form.observation,
        tagIds: form.tags.map((t) => t.id),
      });
      setModalCreate({ visible: false });
      paymentsSWR.mutate();
    } catch (err) {}
  };

  return (
    <div className="page payments">
      <ModalCreatePayment
        visible={modalCreate.visible}
        onClose={() => setModalCreate({ visible: false })}
        onSubmit={onCreatePayment}
      />
      <h1>Payments</h1>
      <Button onClick={() => setModalCreate({ visible: true })}>
        Create payment
      </Button>
      <main>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Data do pagamento</th>
              <th>Adicionado em</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentsSWR.isLoading ? (
              <tr>Is loading</tr>
            ) : paymentsSWR.error || !paymentsSWR.data ? (
              <tr>Error</tr>
            ) : (
              paymentsSWR.data.map((c) => (
                <tr key={"category_" + c.id}>
                  <td>#{c.id}</td>
                  <td>{c.category?.label}</td>
                  <td>R$ {numberToCurrency(c.value)}</td>
                  <td>{c.description}</td>
                  <td>{c.status}</td>
                  <td>{formatDate(c.paymentDate)}</td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td>Actions</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(totalItems / pagination.pageSize)}
        onPageClick={(page) => setPagination((l) => ({ ...l, page }))}
      />
    </div>
  );
};
