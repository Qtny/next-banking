import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";
import { transactionCategoryStyles } from "@/constants";

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  const CategoryPill = ({ category }: { category: string }) => {
    const { borderColor, backgroundColor, chipBackgroundColor, textColor } =
      transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;
    return (
      <div className={cn("flex gap-1 border-[1.5px] justify-center items-center w-fit rounded-full px-[6px] py-1", borderColor, chipBackgroundColor)}>
        <div className={cn("size-2 rounded-full", backgroundColor)} />
        <p className={cn("text-xs font-medium", textColor)}>{category}</p>
      </div>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F9FAFB] text-xs text-gray-600 font-medium">
          <TableHead className="">Transaction</TableHead>
          <TableHead className="">Amount</TableHead>
          <TableHead className="">Status</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="max-md:hidden">Channel</TableHead>
          <TableHead className="max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatAmount(t.amount);
          const isDebit = t.type === "debit";
          const isCredit = t.type === "credit";

          return (
            <TableRow key={t.id} className={`${status === "Success" ? "bg-[#F6FEF9]" : status === "Processing" ? "bg-white" : "bg-[#FFFBFA]"}`}>
              <TableCell className="font-medium text-gray-900 text-sm">{removeSpecialCharacters(t.name)}</TableCell>
              <TableCell className={`font-semibold text-sm ${amount[0] == "-" ? "text-[#F04438]" : "text-[#039855]"}`}>{amount}</TableCell>
              <TableCell className="">
                <CategoryPill category={status} />
              </TableCell>
              <TableCell className="">{formatDateTime(new Date(t.date)).dateTime}</TableCell>
              <TableCell className="max-md:hidden">{t.paymentChannel}</TableCell>
              <TableCell className="max-md:hidden">
                <CategoryPill category={t.category.split(" ")[0]} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
