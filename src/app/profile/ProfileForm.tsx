"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    email?: string | null;
    given_name?: string | null;
    family_name?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: `${user.given_name || ''} ${user.family_name || ''}`.trim(),
      email: user.email || '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          form.reset({
            fullName: data.fullName || `${user.given_name || ''} ${user.family_name || ''}`.trim(),
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };
    loadUserProfile();
  }, [user.id, user.email, user.given_name, user.family_name, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsUpdating(true);
      await setDoc(doc(db, "users", user.id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-8 md:p-10 shadow-xl border-2 border-gray-100 bg-white/80 backdrop-blur">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    {...field} 
                    className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    {...field} 
                    disabled 
                    className="h-12 text-base bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed"
                  />
                </FormControl>
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    {...field} 
                    className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700">
                  Address
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your address" 
                    {...field} 
                    rows={4}
                    className="text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <LoadingButton 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()} 
              disabled={isUpdating} 
              isLoading={false}
              className="h-12 text-base font-semibold border-2 hover:bg-gray-50"
            >
              Reset
            </LoadingButton>
            <LoadingButton 
              type="submit" 
              isLoading={isUpdating}
              className="h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 flex-1"
            >
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </Form>
    </Card>
  );
}
