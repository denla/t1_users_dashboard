"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { ChevronDownIcon, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
  birthDate: z.date({ required_error: "Date of birth is required" }),
  telephone: z.string().min(1, "Phone is required"),
  employment: z.string().min(1, "Employment is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surName: "",
      birthDate: undefined,
      telephone: "",
      employment: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("test");
    const payload = {
      ...data,
      fullName: `${data.name} ${data.surName}`,
      birthDate: data.birthDate.toISOString(),
    };

    try {
      await axios.patch(`/api/v1/users/${id}`, payload);
      navigate(`/`);
    } catch (err) {
      alert("Error while updating user");
      console.error("Error while updating user:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`);
        const user = response.data;

        reset({
          ...user,
          birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
          userAgreement: true,
        });
      } catch (error) {
        console.error("Error while fetching user:", error);
      }
    };

    fetchUser();
  }, [id, reset]);

  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
        <ArrowLeft />
        Back
      </Button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-center items-center w-full mt-10">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit user</CardTitle>
              <CardDescription>Enter data below</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {[
                { id: "name", label: "Name", type: "text", error: errors.name },
                {
                  id: "surName",
                  label: "Lastname",
                  type: "text",
                  error: errors.surName,
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
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    {...register(field.id as keyof RegisterFormData)}
                  />
                  {field.error && (
                    <p className="text-sm text-red-500">
                      {field.error.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth date</Label>
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
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}
