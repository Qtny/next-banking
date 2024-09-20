import { paymentFormSchema } from "@/lib/utils";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const CustomPaymentInput = ({
  control,
  label,
  name,
  placeholder,
}: {
  control: Control<z.infer<typeof paymentFormSchema>>;
  label: string;
  name: FieldPath<z.infer<typeof paymentFormSchema>>;
  placeholder: string;
}) => {
  return (
    <div className="py-6">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex max-md:flex-col max-md:gap-2 gap-8 w-full">
            <div className="w-full max-w-[280px]">
              <FormLabel>{label}</FormLabel>
            </div>
            <div className="flex flex-col w-full gap-2">
              <FormControl>
                <Input placeholder={placeholder} type="text" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomPaymentInput;
