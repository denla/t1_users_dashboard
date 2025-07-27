import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import { Label } from "@/shared/ui/shadcn/label";
import { Calendar } from "@/shared/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surName: z.string().min(1, "Lastname is required"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
  email: z.string().email("Incorrect email"),
  birthDate: z.date({ required_error: "Date of birth is required" }),
  telephone: z.string().min(1, "Phone is required"),
  employment: z.string().min(1, "Employment is required"),
  userAgreement: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      ...data,
      fullName: `${data.name} ${data.surName}`,
    };

    try {
      const res = await axios.post("/api/v1/users", payload);
      console.log("User created:", res.data);
      navigate("/");
    } catch (err) {
      console.error("Error creating user:", err);
      alert(
        "Error creating user: " +
          (axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Unknown error")
      );
    }
  };

  const formItems = [
    { id: "name", label: "Name", type: "text", error: errors.name },
    {
      id: "surName",
      label: "Lastname",
      type: "text",
      error: errors.surName,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      error: errors.password,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      error: errors.email,
    },
    {
      id: "telephone",
      label: "Phone",
      type: "text",
      error: errors.telephone,
    },
    {
      id: "employment",
      label: "Employment",
      type: "text",
      error: errors.employment,
    },
  ];

  return (
    <div className="flex justify-center items-center w-full mt-10">
      <Card className="w-full max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Create a user</CardTitle>
            <CardDescription>Enter the data below</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {formItems.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  {...register(field.id as keyof RegisterFormData)}
                  aria-invalid={field.error ? "true" : "false"}
                />
                {errors[field.id as keyof RegisterFormData] && (
                  <p className="text-sm text-red-500">
                    {errors[field.id as keyof RegisterFormData]?.message}
                  </p>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of birth</Label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                      >
                        {field.value
                          ? format(field.value, "dd.MM.yyyy")
                          : "Select date"}
                        <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="userAgreement"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="userAgreement"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                )}
              />
              <Label htmlFor="userAgreement">I agree to the terms</Label>
            </div>
            {errors.userAgreement && (
              <p className="text-sm text-red-500">
                {errors.userAgreement.message}
              </p>
            )}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Create a user
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
